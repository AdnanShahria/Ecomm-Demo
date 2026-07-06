import { Hono } from "hono";
import { sql, and, gte, lte } from "drizzle-orm";
import * as schema from "../../../backend/server/db/schema";
import type { Bindings, Variables } from "../types";

export const dashboardRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

dashboardRouter.get("/stats", async (c) => {
  const db = c.get("db");
  const from = c.req.query("from") ? new Date(parseInt(c.req.query("from")!)) : null;
  const to = c.req.query("to") ? new Date(parseInt(c.req.query("to")!)) : null;

  const dateFilter = and(
    from ? gte(schema.orders.createdAt, from) : undefined,
    to ? lte(schema.orders.createdAt, to) : undefined
  );

  // Run ALL queries in parallel for maximum speed
  const [
    [prodCount],
    [catCount],
    [userCount],
    [orderCount],
    [reviewCount],
    [totalSold],
    [revenueResult],
    statusResults,
    monthlyRevenue,
    recentOrders,
    lowStockProducts
  ] = await Promise.all([
    // 1. Basic Counts (all independent)
    db.select({ count: sql<number>`count(*)` }).from(schema.products),
    db.select({ count: sql<number>`count(*)` }).from(schema.categories),
    db.select({ count: sql<number>`count(*)` }).from(schema.users),
    db.select({ count: sql<number>`count(*)` }).from(schema.orders),
    db.select({ count: sql<number>`count(*)` }).from(schema.reviews),
    // Total Sold (Quantity from order_items)
    db.select({ total: sql<number>`sum(quantity)` }).from(schema.orderItems),
    // 2. Revenue calculation with date filtering
    db.select({ total: sql<number>`sum(total_amount)` })
      .from(schema.orders)
      .where(dateFilter),
    // 3. Orders by status
    db.select({ 
        status: schema.orders.status, 
        count: sql<number>`count(*)` 
      })
      .from(schema.orders)
      .where(dateFilter)
      .groupBy(schema.orders.status),
    // 4. Monthly Revenue
    db.select({
        month: sql<string>`strftime('%Y-%m', datetime(created_at, 'unixepoch'))`,
        total: sql<number>`sum(total_amount)`,
        count: sql<number>`count(*)`
      })
      .from(schema.orders)
      .where(dateFilter)
      .groupBy(sql`strftime('%Y-%m', datetime(created_at, 'unixepoch'))`)
      .orderBy(sql`strftime('%Y-%m', datetime(created_at, 'unixepoch'))`),
    // 5. Recent Orders
    db.select({
        id: schema.orders.id,
        invoiceId: schema.orders.invoiceId,
        customerName: schema.orders.customerName,
        status: schema.orders.status,
        totalAmount: schema.orders.totalAmount
      })
      .from(schema.orders)
      .orderBy(sql`created_at DESC`)
      .limit(5),
    // 6. Low Stock Products
    db.select({
        id: schema.products.id,
        title: schema.products.title,
        stock: schema.products.stock
      })
      .from(schema.products)
      .where(sql`stock <= 5`)
      .limit(5)
  ]);

  const ordersByStatus = statusResults.reduce((acc: any, curr: any) => {
    acc[curr.status || 'unknown'] = curr.count;
    return acc;
  }, {});

  return c.json({
    counts: {
      products: prodCount?.count || 0,
      categories: catCount?.count || 0,
      users: userCount?.count || 0,
      orders: orderCount?.count || 0,
      reviews: reviewCount?.count || 0,
      totalSold: totalSold?.total || 0,
    },
    revenue: {
      total: revenueResult?.total || 0,
      currency: "BDT",
    },
    ordersByStatus,
    recentOrders,
    lowStockProducts,
    monthlyRevenue,
    timestamp: new Date().toISOString(),
  });
});
