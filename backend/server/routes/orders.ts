import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { orders, orderItems, trackings } from '../db/schema';
import { getDbClient } from '../db/client';
import { Bindings, Variables } from './types';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get('/', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const customerName = c.req.query('customerName');
  
  if (!customerName) {
    return c.json({ items: [] });
  }
  
  // Using query builder for relations
  const userOrders = await db.query.orders.findMany({
    where: eq(orders.customerName, customerName),
    orderBy: [desc(orders.createdAt)],
    with: {
      items: true,
      trackings: true
    }
  });
  
  return c.json({ items: userOrders });
});

app.get('/:id', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const id = c.req.param('id');
  
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: true,
      trackings: true
    }
  });
  
  if (!order) {
    return c.json({ message: 'Order not found' }, 404);
  }
  
  return c.json(order);
});

app.post('/', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const body = await c.req.json();
  
  const id = crypto.randomUUID();
  const invoiceId = `INV-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  
  await db.insert(orders).values({
    id,
    invoiceId,
    userId: body.userId,
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone,
    shippingAddress: body.shippingAddress,
    totalAmount: body.totalAmount,
    status: 'pending',
    paymentMethod: body.paymentMethod || 'cod',
    paymentPhone: body.paymentPhone,
    paymentTrxId: body.paymentTrxId,
    createdAt: new Date(),
  }).run();
  
  if (body.items && Array.isArray(body.items)) {
    for (const item of body.items) {
      await db.insert(orderItems).values({
        id: crypto.randomUUID(),
        orderId: id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }).run();
    }
  }
  
  await db.insert(trackings).values({
    id: crypto.randomUUID(),
    orderId: id,
    status: 'Order Placed',
    message: 'Your order has been successfully placed.',
    createdAt: new Date(),
  }).run();
  
  return c.json({ success: true, orderId: id, invoiceId });
});

app.post('/:id/cancel', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const id = c.req.param('id');
  const { reason } = await c.req.json();
  
  await db.update(orders).set({ status: 'cancelled' }).where(eq(orders.id, id)).run();
  
  await db.insert(trackings).values({
    id: crypto.randomUUID(),
    orderId: id,
    status: 'Cancelled',
    message: reason || 'Order cancelled by customer',
    createdAt: new Date(),
  }).run();
  
  return c.json({ success: true });
});

export default app;
