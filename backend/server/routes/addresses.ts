import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { addresses } from '../db/schema';
import { getDbClient } from '../db/client';
import { Bindings, Variables } from './types';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get('/', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const userId = c.req.query('userId');
  
  if (!userId) {
    return c.json({ message: 'userId query parameter is required' }, 400);
  }
  
  const userAddresses = await db.select().from(addresses).where(eq(addresses.userId, userId)).all();
  return c.json({ items: userAddresses });
});

app.post('/', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const body = await c.req.json();
  
  const id = crypto.randomUUID();
  
  // If this is set as default, we should unset others for this user
  if (body.isDefault === 1) {
    await db.update(addresses)
      .set({ isDefault: 0 })
      .where(eq(addresses.userId, body.userId))
      .run();
  }
  
  await db.insert(addresses).values({
    id,
    ...body,
    createdAt: new Date(),
  }).run();
  
  const newAddress = await db.select().from(addresses).where(eq(addresses.id, id)).get();
  return c.json(newAddress, 201);
});

app.patch('/:id', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const id = c.req.param('id');
  const body = await c.req.json();
  
  const existing = await db.select().from(addresses).where(eq(addresses.id, id)).get();
  if (!existing) return c.json({ message: 'Address not found' }, 404);
  
  // If this is set as default, we should unset others for this user
  if (body.isDefault === 1) {
    await db.update(addresses)
      .set({ isDefault: 0 })
      .where(eq(addresses.userId, existing.userId))
      .run();
  }
  
  await db.update(addresses).set(body).where(eq(addresses.id, id)).run();
  
  const updatedAddress = await db.select().from(addresses).where(eq(addresses.id, id)).get();
  return c.json(updatedAddress);
});

app.delete('/:id', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const id = c.req.param('id');
  
  await db.delete(addresses).where(eq(addresses.id, id)).run();
  
  return c.json({ success: true, message: 'Address deleted' });
});

export default app;
