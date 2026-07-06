import { Hono } from 'hono';
import { eq, and, desc } from 'drizzle-orm';
import { users, walletTransactions, addresses, orders, returns, reviews, notifications } from '../db/schema';
import { getDbClient } from '../db/client';
import { Bindings, Variables } from './types';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get('/user', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const userId = c.req.query('userId');
  const customerName = c.req.query('customerName');
  
  if (!userId) {
    return c.json({ message: 'userId query parameter is required' }, 400);
  }

  // 1. Profile
  const profile = await db.select().from(users).where(eq(users.id, userId)).get();
  if (profile) {
    (profile as any).passwordHash = undefined;
  }

  // 2. Wallet
  const txns = await db.select().from(walletTransactions).where(eq(walletTransactions.userId, userId)).orderBy(desc(walletTransactions.createdAt)).all();
  let balance = 0;
  for (const txn of txns) {
    if (txn.type === 'credit') balance += txn.amount;
    else balance -= txn.amount;
  }
  const wallet = { balance, transactions: txns };

  // 3. Addresses
  const addressItems = await db.select().from(addresses).where(eq(addresses.userId, userId)).all();

  // 4. Orders
  let orderItems: any[] = [];
  if (customerName) {
    orderItems = await db.query.orders.findMany({
      where: eq(orders.customerName, customerName),
      orderBy: [desc(orders.createdAt)],
      with: { items: true, trackings: true }
    });
  }

  // 5. Returns & Cancellations
  const returnItems = await db.select().from(returns).where(and(eq(returns.userId, userId), eq(returns.type, 'return'))).orderBy(desc(returns.createdAt)).all();
  const cancellationItems = await db.select().from(returns).where(and(eq(returns.userId, userId), eq(returns.type, 'cancellation'))).orderBy(desc(returns.createdAt)).all();

  // 6. Reviews
  const reviewItemsRaw = await db.select().from(reviews).where(eq(reviews.userId, userId)).orderBy(desc(reviews.createdAt)).all();
  const reviewItems = reviewItemsRaw.map(r => ({ ...r, images: r.images ? JSON.parse(r.images) : undefined }));

  // 7. Notifications
  const notifs = await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).all();
  const unreadCount = notifs.filter(n => n.isRead === 0).length;

  return c.json({
    profile,
    wallet,
    addresses: { items: addressItems },
    orders: { items: orderItems },
    returns: { items: returnItems.map(r => ({ ...r, images: r.images ? JSON.parse(r.images) : undefined })) },
    cancellations: { items: cancellationItems.map(r => ({ ...r, images: r.images ? JSON.parse(r.images) : undefined })) },
    reviews: { items: reviewItems },
    notifications: { unreadCount, latest: notifs.slice(0, 10) },
    timestamp: new Date().toISOString()
  });
});

export default app;
