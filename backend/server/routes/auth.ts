import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { sign } from 'hono/jwt';
import { users, otpCodes } from '../db/schema';
import { getDbClient } from '../db/client';
import { Bindings, Variables } from './types';
import { hashPassword, verifyPassword, generateOTP } from '../utils/crypto';
import { sendEmail } from '../utils/email';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.post('/register', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const body = await c.req.json();
  
  // Check if username exists
  const existingUser = await db.select().from(users).where(eq(users.username, body.username)).get();
  if (existingUser) {
    return c.json({ message: 'Username already exists' }, 400);
  }
  
  // Check if email exists
  if (body.email) {
    const existingEmail = await db.select().from(users).where(eq(users.email, body.email)).get();
    if (existingEmail) {
      return c.json({ message: 'Email already registered' }, 400);
    }
  }

  const userId = crypto.randomUUID();
  const hashedPassword = await hashPassword(body.password);
  
  await db.insert(users).values({
    id: userId,
    username: body.username,
    email: body.email,
    phone: body.phone,
    fullName: body.fullName,
    passwordHash: hashedPassword,
    isVerified: 0,
    role: 'user',
    createdAt: new Date(),
  }).run();
  
  // Generate OTP
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
  
  await db.insert(otpCodes).values({
    id: crypto.randomUUID(),
    userId: userId,
    code,
    type: 'email_verify',
    expiresAt,
    used: 0,
    createdAt: new Date()
  }).run();
  
  // Send Email (async, non-blocking)
  if (body.email) {
    c.executionCtx.waitUntil(
      sendEmail(
        c.env.GOOGLE_SCRIPT_URL,
        body.email,
        'Welcome to Aurelia - Verify Your Email',
        `<p>Hi ${body.fullName || body.username},</p><p>Your verification code is: <strong>${code}</strong></p>`
      )
    );
  }
  
  const newUser = await db.select().from(users).where(eq(users.id, userId)).get();
  if (newUser) (newUser as any).passwordHash = undefined;
  
  return c.json({ message: 'Registration successful. Please verify OTP.', user: newUser }, 201);
});

app.post('/login', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const { username, password } = await c.req.json();
  
  const user = await db.select().from(users).where(eq(users.username, username)).get();
  if (!user) {
    return c.json({ message: 'Invalid credentials' }, 401);
  }
  
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return c.json({ message: 'Invalid credentials' }, 401);
  }
  
  if (user.isBlocked) {
    return c.json({ message: 'Account is blocked' }, 403);
  }
  
  const token = await sign({
    id: user.id,
    username: user.username,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
  }, c.env.JWT_SECRET || 'fallback-secret');
  
  (user as any).passwordHash = undefined;
  
  return c.json({
    message: 'Login successful',
    token,
    user
  });
});

app.post('/verify-otp', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const { userId, code } = await c.req.json();
  
  const otpRec = await db.select()
    .from(otpCodes)
    .where(and(
      eq(otpCodes.userId, userId),
      eq(otpCodes.type, 'email_verify'),
      eq(otpCodes.used, 0)
    ))
    .get(); // Since we might have multiple, we should ideally sort by createdAt desc. But get() is fine if we invalidate old ones.
    
  if (!otpRec || otpRec.code !== code) {
    return c.json({ message: 'Invalid or expired OTP' }, 400);
  }
  
  if (new Date() > new Date(otpRec.expiresAt)) {
    return c.json({ message: 'OTP has expired' }, 400);
  }
  
  await db.update(otpCodes).set({ used: 1 }).where(eq(otpCodes.id, otpRec.id)).run();
  await db.update(users).set({ isVerified: 1 }).where(eq(users.id, userId)).run();
  
  const updatedUser = await db.select().from(users).where(eq(users.id, userId)).get();
  if (updatedUser) (updatedUser as any).passwordHash = undefined;
  
  return c.json({ message: 'Email verified successfully', user: updatedUser });
});

app.post('/resend-otp', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const { userId } = await c.req.json();
  
  const user = await db.select().from(users).where(eq(users.id, userId)).get();
  if (!user || !user.email) {
    return c.json({ message: 'User or email not found' }, 404);
  }
  
  // Invalidate previous OTPs
  await db.update(otpCodes).set({ used: 1 }).where(and(eq(otpCodes.userId, userId), eq(otpCodes.type, 'email_verify'))).run();
  
  const code = generateOTP();
  await db.insert(otpCodes).values({
    id: crypto.randomUUID(),
    userId: userId,
    code,
    type: 'email_verify',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    used: 0,
    createdAt: new Date()
  }).run();
  
  c.executionCtx.waitUntil(
    sendEmail(
      c.env.GOOGLE_SCRIPT_URL,
      user.email,
      'Your New Verification Code',
      `<p>Your new verification code is: <strong>${code}</strong></p>`
    )
  );
  
  return c.json({ message: 'OTP sent successfully' });
});

app.post('/forgot-password', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const { email } = await c.req.json();
  
  const user = await db.select().from(users).where(eq(users.email, email)).get();
  if (!user) {
    return c.json({ message: 'If the email exists, a code has been sent.' }); // Generic response for security
  }
  
  const code = generateOTP();
  await db.insert(otpCodes).values({
    id: crypto.randomUUID(),
    userId: user.id,
    code,
    type: 'password_reset',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    used: 0,
    createdAt: new Date()
  }).run();
  
  c.executionCtx.waitUntil(
    sendEmail(
      c.env.GOOGLE_SCRIPT_URL,
      user.email!,
      'Password Reset Request',
      `<p>Your password reset code is: <strong>${code}</strong></p>`
    )
  );
  
  return c.json({ message: 'If the email exists, a code has been sent.' });
});

app.post('/reset-password', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const { email, code, newPassword } = await c.req.json();
  
  const user = await db.select().from(users).where(eq(users.email, email)).get();
  if (!user) return c.json({ message: 'Invalid request' }, 400);
  
  const otpRec = await db.select()
    .from(otpCodes)
    .where(and(
      eq(otpCodes.userId, user.id),
      eq(otpCodes.type, 'password_reset'),
      eq(otpCodes.used, 0)
    ))
    .get();
    
  if (!otpRec || otpRec.code !== code || new Date() > new Date(otpRec.expiresAt)) {
    return c.json({ message: 'Invalid or expired OTP' }, 400);
  }
  
  const hashedPassword = await hashPassword(newPassword);
  
  await db.update(users).set({ passwordHash: hashedPassword }).where(eq(users.id, user.id)).run();
  await db.update(otpCodes).set({ used: 1 }).where(eq(otpCodes.id, otpRec.id)).run();
  
  return c.json({ message: 'Password reset successfully' });
});

export default app;
