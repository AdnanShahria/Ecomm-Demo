import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { walletTransactions } from '../db/schema';
import { getDbClient } from '../db/client';
import { Bindings, Variables } from './types';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Helper to get current balance
async function getBalance(db: ReturnType<typeof getDbClient>, userId: string) {
  const txns = await db.select().from(walletTransactions).where(eq(walletTransactions.userId, userId)).all();
  let balance = 0;
  for (const txn of txns) {
    if (txn.type === 'credit') {
      balance += txn.amount;
    } else {
      balance -= txn.amount;
    }
  }
  return balance;
}

app.get('/', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const userId = c.req.query('userId');
  
  if (!userId) {
    return c.json({ message: 'userId query parameter is required' }, 400);
  }
  
  const balance = await getBalance(db, userId);
  const transactions = await db.select()
    .from(walletTransactions)
    .where(eq(walletTransactions.userId, userId))
    .orderBy(desc(walletTransactions.createdAt))
    .all();
    
  return c.json({ balance, transactions });
});

app.post('/topup', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const { userId, amount, reference } = await c.req.json();
  
  const currentBalance = await getBalance(db, userId);
  const balanceAfter = currentBalance + amount;
  
  const id = crypto.randomUUID();
  await db.insert(walletTransactions).values({
    id,
    userId,
    amount,
    type: 'credit',
    reference: reference || 'Top-up',
    balanceAfter,
    createdAt: new Date(),
  }).run();
  
  return c.json({ success: true, balance: balanceAfter });
});

app.post('/charge', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const { userId, amount, reference } = await c.req.json();
  
  const currentBalance = await getBalance(db, userId);
  if (currentBalance < amount) {
    return c.json({ message: 'Insufficient funds' }, 400);
  }
  
  const balanceAfter = currentBalance - amount;
  
  const id = crypto.randomUUID();
  await db.insert(walletTransactions).values({
    id,
    userId,
    amount,
    type: 'debit',
    reference: reference || 'Charge',
    balanceAfter,
    createdAt: new Date(),
  }).run();
  
  return c.json({ success: true, balance: balanceAfter });
});

export default app;
