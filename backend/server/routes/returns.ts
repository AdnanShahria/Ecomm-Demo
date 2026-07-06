import { Hono } from 'hono';
import { eq, and, desc } from 'drizzle-orm';
import { returns } from '../db/schema';
import { getDbClient } from '../db/client';
import { Bindings, Variables } from './types';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get('/', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const userId = c.req.query('userId');
  const type = c.req.query('type'); // 'return' or 'cancellation'
  
  if (!userId) {
    return c.json({ message: 'userId query parameter is required' }, 400);
  }
  
  let query = db.select().from(returns).where(eq(returns.userId, userId));
  
  if (type) {
    query = db.select().from(returns).where(and(eq(returns.userId, userId), eq(returns.type, type)));
  }
  
  const items = await query.orderBy(desc(returns.createdAt)).all();
  
  return c.json({ items: items.map(item => ({
    ...item,
    images: item.images ? JSON.parse(item.images) : undefined
  }))});
});

app.post('/', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const body = await c.req.json();
  
  const id = crypto.randomUUID();
  
  await db.insert(returns).values({
    id,
    orderId: body.orderId,
    userId: body.userId,
    reason: body.reason,
    type: body.type, // 'return' | 'cancellation'
    details: body.details,
    images: body.images ? JSON.stringify(body.images) : null,
    status: 'pending',
    createdAt: new Date(),
  }).run();
  
  const newReturn = await db.select().from(returns).where(eq(returns.id, id)).get();
  return c.json({ 
    ...newReturn, 
    images: newReturn?.images ? JSON.parse(newReturn.images) : undefined 
  }, 201);
});

export default app;
