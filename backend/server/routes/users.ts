import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { getDbClient } from '../db/client';
import { Bindings, Variables } from './types';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get('/:id', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const id = c.req.param('id');
  const user = await db.select().from(users).where(eq(users.id, id)).get();
  
  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }
  
  // Omit password hash
  const { passwordHash, ...safeUser } = user;
  return c.json(safeUser);
});

app.patch('/:id', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const id = c.req.param('id');
  const body = await c.req.json();
  
  // Update allowed fields
  const updateData: Partial<typeof users.$inferInsert> = {};
  if (body.fullName !== undefined) updateData.fullName = body.fullName;
  if (body.phone !== undefined) updateData.phone = body.phone;
  if (body.avatar !== undefined) updateData.avatar = body.avatar;
  
  await db.update(users).set(updateData).where(eq(users.id, id)).run();
  
  const updatedUser = await db.select().from(users).where(eq(users.id, id)).get();
  
  return c.json(updatedUser);
});

app.patch('/:id/password', async (c) => {
  // Dummy password update for now
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const id = c.req.param('id');
  const { currentPassword, newPassword } = await c.req.json();
  
  // In a real app we'd verify the currentPassword hash here, then hash the new one
  await db.update(users).set({ passwordHash: newPassword }).where(eq(users.id, id)).run();
  
  return c.json({ success: true, message: 'Password updated' });
});

export default app;
