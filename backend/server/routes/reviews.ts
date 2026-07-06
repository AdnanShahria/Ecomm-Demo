import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { reviews } from '../db/schema';
import { getDbClient } from '../db/client';
import { Bindings, Variables } from './types';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get('/', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const userId = c.req.query('userId');
  const productId = c.req.query('productId');
  const sort = c.req.query('sort') || 'latest';
  const hasImages = c.req.query('hasImages') === 'true';
  
  let query = db.select().from(reviews);
  
  if (userId) {
    query = query.where(eq(reviews.userId, userId));
  } else if (productId) {
    query = query.where(eq(reviews.productId, productId));
  }
  
  if (sort === 'helpful') {
    query = query.orderBy(desc(reviews.helpfulCount));
  } else {
    query = query.orderBy(desc(reviews.createdAt));
  }
  
  let items = await query.all();
  
  if (hasImages) {
    items = items.filter(r => r.images && JSON.parse(r.images).length > 0);
  }
  
  // Calculate stats if productId is provided
  let stats = null;
  if (productId && !userId) {
    const allProductReviews = await db.select().from(reviews).where(eq(reviews.productId, productId)).all();
    const total = allProductReviews.length;
    let sum = 0;
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    allProductReviews.forEach(r => {
      sum += r.rating;
      if (r.rating >= 1 && r.rating <= 5) {
        ratingCounts[r.rating as keyof typeof ratingCounts]++;
      }
    });
    
    stats = {
      average: total > 0 ? Number((sum / total).toFixed(1)) : 0,
      total,
      ratingCounts,
      hasImagesCount: allProductReviews.filter(r => r.images && JSON.parse(r.images).length > 0).length
    };
  }
  
  return c.json({ items, stats });
});

app.post('/', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const body = await c.req.json();
  
  const id = crypto.randomUUID();
  await db.insert(reviews).values({
    id,
    ...body,
    images: body.images ? JSON.stringify(body.images) : null,
    createdAt: new Date(),
  }).run();
  
  const newReview = await db.select().from(reviews).where(eq(reviews.id, id)).get();
  if (newReview && newReview.images) {
    newReview.images = JSON.parse(newReview.images) as any;
  }
  return c.json(newReview, 201);
});

app.patch('/:id', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const id = c.req.param('id');
  const body = await c.req.json();
  
  const updateData = { ...body };
  if (updateData.images) {
    updateData.images = JSON.stringify(updateData.images);
  }
  
  await db.update(reviews).set(updateData).where(eq(reviews.id, id)).run();
  
  const updatedReview = await db.select().from(reviews).where(eq(reviews.id, id)).get();
  if (updatedReview && updatedReview.images) {
    updatedReview.images = JSON.parse(updatedReview.images) as any;
  }
  return c.json(updatedReview);
});

app.patch('/:id/helpful', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const id = c.req.param('id');
  
  const review = await db.select().from(reviews).where(eq(reviews.id, id)).get();
  if (!review) return c.json({ message: 'Review not found' }, 404);
  
  const newCount = (review.helpfulCount || 0) + 1;
  await db.update(reviews).set({ helpfulCount: newCount }).where(eq(reviews.id, id)).run();
  
  return c.json({ success: true, helpfulCount: newCount });
});

app.delete('/:id', async (c) => {
  const db = getDbClient(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
  const id = c.req.param('id');
  
  await db.delete(reviews).where(eq(reviews.id, id)).run();
  
  return c.json({ success: true });
});

export default app;
