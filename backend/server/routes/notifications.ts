import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { notifications } from '../db/schema';
import { getDbClient } from '../db/client';
import { Bindings, Variables } from './types';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get('/', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const userId = c.req.query('userId');
  
  if (!userId) {
    return c.json({ items: [] });
  }
  
  const items = await db.select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .all();
    
  return c.json({ items });
});

app.post('/:id/read', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const id = c.req.param('id');
  
  await db.update(notifications).set({ isRead: 1 }).where(eq(notifications.id, id)).run();
  
  return c.json({ success: true });
});

export default app;
