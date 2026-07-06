import { Hono } from "hono";
import { eq, and, desc, isNull, or, inArray, sql } from "drizzle-orm";
import * as schema from "../../../backend/server/db/schema";
import type { Bindings, Variables } from "../types";
import { fetchHomeBulkData } from "../utils/helpers";
import { getCachedResponse, setCachedResponse } from "../utils/cache";

const HOME_CACHE_TTL_MS = 3600_000; // 1 hour D1 cache TTL

export const bulkRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

/**
 * Consolidates all user-related data for the dashboard/account view into a single request.
 * This replaces up to 10+ separate API calls.
 */
bulkRouter.get("/user", async (c) => {
  const db = c.get("db");
  const userId = c.req.query("userId");
  const customerName = c.req.query("customerName");
  const email = c.req.query("email");

  if (!userId) {
    return c.json({ error: "userId query parameter is required" }, 400);
  }

  try {
    const [
      userProfile,
      walletTransactions,
      addresses,
      orders,
      returns,
      cancellations,
      reviews,
      notificationCount
    ] = await Promise.all([
      // 1. User Profile
      db.query.users.findFirst({
        where: (u: any, { eq }: any) => eq(u.id, userId)
      }),
      // 2. Wallet Transactions & Balance
      db.query.walletTransactions.findMany({
        where: (t: any, { eq }: any) => eq(t.userId, userId),
        orderBy: (t: any, { desc }: any) => [desc(t.createdAt)]
      }),
      // 3. Addresses
      db.query.addresses.findMany({
        where: (a: any, { eq }: any) => eq(a.userId, userId),
        orderBy: (a: any, { desc }: any) => [desc(a.createdAt)]
      }),
      // 4. Orders (Unified query for registered & guest checkouts)
      db.query.orders.findMany({
        where: (o: any, { eq, or }: any) => {
          const conds = [];
          if (userId && userId.trim() !== "") conds.push(eq(o.userId, userId));
          if (customerName && customerName.trim() !== "") conds.push(eq(o.customerName, customerName));
          if (email && email.trim() !== "") conds.push(eq(o.customerEmail, email));
          return conds.length > 0 ? or(...conds) : undefined;
        },
        with: {
          items: true
        },
        orderBy: (o: any, { desc }: any) => [desc(o.createdAt)]
      }),
      // 5. Returns
      db.query.returns.findMany({
        where: (r: any, { eq, and }: any) => and(eq(r.userId, userId), eq(r.type, 'return')),
        orderBy: (r: any, { desc }: any) => [desc(r.createdAt)]
      }),
      // 6. Cancellations
      db.query.returns.findMany({
        where: (r: any, { eq, and }: any) => and(eq(r.userId, userId), eq(r.type, 'cancellation')),
        orderBy: (r: any, { desc }: any) => [desc(r.createdAt)]
      }),
      // 7. Reviews
      db.query.reviews.findMany({
        where: (r: any, { eq }: any) => eq(r.userId, userId),
        orderBy: (r: any, { desc }: any) => [desc(r.createdAt)]
      }),
      // 8. Unread Notifications Count
      db.query.notifications.findMany({
        where: (n: any, { eq, and, or, isNull }: any) => and(
          eq(n.isRead, 0),
          or(eq(n.userId, userId), isNull(n.userId))
        )
      })
    ]);

    return c.json({
      profile: userProfile || null,
      wallet: {
        balance: walletTransactions.length > 0 ? (walletTransactions[0].balanceAfter ?? 0) : 0,
        transactions: walletTransactions
      },
      addresses: { items: addresses },
      orders: { items: orders },
      returns: { items: returns },
      cancellations: { items: cancellations },
      reviews: { items: reviews },
      notifications: { 
        unreadCount: notificationCount.length,
        latest: notificationCount.slice(0, 5)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return c.json({ error: "Bulk user fetch failed", details: error.message }, 500);
  }
});

/**
 * Admin Stats for Sidebar badges.
 */
bulkRouter.get("/admin/stats", async (c) => {
  const db = c.get("db");

  try {
    const [
      pendingOrders,
      pendingReturns,
      pendingReviews,
      unreadNotifications
    ] = await Promise.all([
      // 1. Pending Orders
      db.select({ value: sql<number>`count(*)` })
        .from(schema.orders)
        .where(or(
          eq(schema.orders.status, "Pending"),
          eq(schema.orders.status, "pending"),
          eq(schema.orders.status, "Pending Verification"),
          eq(schema.orders.status, "Processing"),
          eq(schema.orders.status, "processing")
        )),
      // 2. Pending Returns
      db.select({ value: sql<number>`count(*)` })
        .from(schema.returns)
        .where(eq(schema.returns.status, "Requested")),
      // 3. Pending Reviews
      db.select({ value: sql<number>`count(*)` })
        .from(schema.reviews)
        .where(or(
          eq(schema.reviews.status, "pending"),
          eq(schema.reviews.status, "Pending")
        )),
      // 4. Unread Admin Notifications
      db.select({ value: sql<number>`count(*)` })
        .from(schema.notifications)
        .where(and(
          isNull(schema.notifications.userId),
          eq(schema.notifications.isRead, 0)
        ))
    ]);

    return c.json({
      orders: pendingOrders[0]?.value ?? 0,
      returns: pendingReturns[0]?.value ?? 0,
      reviews: pendingReviews[0]?.value ?? 0,
      notifications: unreadNotifications[0]?.value ?? 0,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Admin stats fetch error:", error.message);
    return c.json({ orders: 0, returns: 0, reviews: 0, notifications: 0 }, 500);
  }
});

bulkRouter.get("/home", async (c) => {
  const db = c.get("db");

  try {
    // 1. Check Cloudflare Edge Cache First (works in production only)
    const edgeCached = await getCachedResponse("home_bulk");
    
    if (edgeCached) {
      return c.json({
        ...edgeCached,
        _cached: true,
        _cacheType: "cloudflare_edge"
      });
    }

    // 2. Fallback: Check Cloudflare KV cache (works everywhere including local dev)
    const kv = (c.env as any).CACHE_KV;
    if (kv) {
      const kvCached = await kv.get("home_bulk", { type: "json" });
      if (kvCached) {
        return c.json({
          ...kvCached,
          _cached: true,
          _cacheType: "cloudflare_kv"
        });
      }
    }

    // 3. Fetch fresh data (no cache hit)
    const structuredData = await fetchHomeBulkData(db, schema);
    
    // Add timestamp for cache debugging
    const responseData = { ...structuredData, _cached: false, _cacheType: "none" };

    // 4. Auto-cache for next time (Skip if read-only)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isReadOnly = (c.env as any).DB_READ_ONLY === "true" || (c.env as any).DB_READ_ONLY === "1";
    
    if (!isReadOnly) {
      // Cache in edge (24 hours) — will silently fail in local dev
      await setCachedResponse(c, "home_bulk", responseData, 86400);
      
      // Also persist to Cloudflare KV (works everywhere)
      if (kv) {
        // Cache in KV for 1 hour
        const kvPromise = kv.put("home_bulk", JSON.stringify(responseData), { expirationTtl: 3600 });
        if (c.executionCtx) c.executionCtx.waitUntil(kvPromise);
        else await kvPromise;
      }
    }

    return c.json(responseData);
  } catch (error: any) {
    console.error("Home bulk fetch error:", error);
    return c.json({ error: "Home bulk fetch failed", details: error.message }, 500);
  }
});
