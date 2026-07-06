import { Hono } from "hono";
// Product router handling all product related operations
import { eq, count, like, or, and, isNotNull, not, desc } from "drizzle-orm";
import * as schema from "../../../backend/server/db/schema";
import type { Bindings, Variables } from "../types";
import { formatLinks, createPaginatedResponse, invalidateHomeCache } from "../utils/helpers";

export const productsRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

productsRouter.get("/", async (c) => {
  try {
    const db = c.get("db");
    const page = Math.max(1, Number(c.req.query("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") || 12)));
    const offset = (page - 1) * limit;

    const { category, tag, sort, q, hasOffer } = c.req.query();

    // Base query
    let conditions = [];
    if (category) {
      conditions.push(eq(schema.products.categoryId, category));
    }
    if (q) {
      conditions.push(
        or(
          like(schema.products.title, `%${q}%`),
          like(schema.products.brand, `%${q}%`)
        )
      );
    }
    if (tag) {
      conditions.push(like(schema.products.tags, `%"${tag}"%`));
    }
    if (hasOffer === 'true') {
      conditions.push(isNotNull(schema.products.salePrice));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalRes] = await db.select({ count: count() }).from(schema.products).where(whereClause);
    const total = totalRes.count;

    const rows = await db.query.products.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (p: any, { desc, asc }: any) => {
        if (sort === "newest") return [desc(p.createdAt)];
        if (sort === "price-low") return [asc(p.price)];
        if (sort === "price-high") return [desc(p.price)];
        if (sort === "best-selling") return [desc(p.soldCount)];
        if (sort === "trending") return [desc(p.rating)];
        return [desc(p.createdAt)]; // default to newest
      }
    });

    return c.json(createPaginatedResponse(
      rows.map((r: any) => ({ ...r, _links: formatLinks(c, "/products", r.id) })),
      total,
      page,
      limit,
      formatLinks(c, "/products")
    ));
  } catch (error: any) {
    console.error("Fetch products error:", error.message);
    return c.json(createPaginatedResponse([], 0, 1, 12, formatLinks(c, "/products")));
  }
});

productsRouter.get("/search", async (c) => {
  try {
    const q = c.req.query("q") ?? "";
    const db = c.get("db");

    const rows = await db.query.products.findMany({
      where: (p: any, { like, or }: any) => or(
        like(p.title, `%${q}%`),
        like(p.brand, `%${q}%`)
      ),
      limit: 10,
    });

    return c.json({
      items: rows.map((r: any) => ({ ...r, _links: formatLinks(c, "/products", r.id) })),
      query: q,
      _links: formatLinks(c, "/products/search")
    });
  } catch (error: any) {
    console.error("Search products error:", error.message);
    return c.json({ items: [], query: c.req.query("q") ?? "", _links: formatLinks(c, "/products/search") });
  }
});

productsRouter.get("/by-slug/:slug/bulk", async (c) => {
  try {
    const slug = c.req.param("slug");
    const recentlyViewedIds = (c.req.query("recentlyViewed") || "").split(",").filter(Boolean);
    const db = c.get("db");

    // 1. Get Main Product
    const [product] = await db.select().from(schema.products).where(eq(schema.products.slug, slug));
    if (!product) return c.json({ error: "Product not found" }, 404);

    const cacheKey = `product_bulk_${product.id}`;
    const [cached] = await db.select().from(schema.systemCache).where(eq(schema.systemCache.key, cacheKey));
    
    let candidates, reviews, reviewStatsRaw;
    const now = new Date();
    const cacheTTL = 10 * 60 * 1000; // 10 minutes

    if (cached && (now.getTime() - new Date(cached.updatedAt).getTime() < cacheTTL)) {
      const cachedData = JSON.parse(cached.data);
      candidates = cachedData.candidates;
      reviews = cachedData.reviews;
      reviewStatsRaw = cachedData.reviewStatsRaw;
    } else {
      const queryTags = (JSON.parse(product.tags || "[]") as string[]).slice(0, 5);
      
      // 2. Fetch everything else in parallel for maximum speed
      const [fCandidates, fReviews, fReviewStatsRaw] = await Promise.all([
        // Candidates for related products
        db.query.products.findMany({
          where: and(
            eq(schema.products.isActive, 1),
            not(eq(schema.products.id, product.id)),
            or(
              ...(product.categoryId ? [eq(schema.products.categoryId, product.categoryId)] : []),
              ...(queryTags.map((tag: string) => like(schema.products.tags, `%"${tag}"%`)))
            )
          ),
          limit: 12
        }),
        // Latest 10 reviews
        db.select().from(schema.reviews)
          .where(and(eq(schema.reviews.productId, product.id), eq(schema.reviews.status, "approved")))
          .orderBy(desc(schema.reviews.createdAt))
          .limit(10),
        // Review statistics (counts per star and average)
        db.select({
          rating: schema.reviews.rating,
          count: count()
        })
        .from(schema.reviews)
        .where(and(eq(schema.reviews.productId, product.id), eq(schema.reviews.status, "approved")))
        .groupBy(schema.reviews.rating)
      ]);

      candidates = fCandidates;
      reviews = fReviews;
      reviewStatsRaw = fReviewStatsRaw;

      // Update Cache
      await db.insert(schema.systemCache).values({
        key: cacheKey,
        data: JSON.stringify({ candidates, reviews, reviewStatsRaw }),
        updatedAt: new Date()
      }).onConflictDoUpdate({
        target: schema.systemCache.key,
        set: { data: JSON.stringify({ candidates, reviews, reviewStatsRaw }), updatedAt: new Date() }
      });
    }

    const currentUserId = c.req.query("userId");
    const [userOrder] = await Promise.all([
      // Check if user has purchased this (for review eligibility)
      currentUserId ? db.select({ id: schema.orders.id })
        .from(schema.orders)
        .innerJoin(schema.orderItems, eq(schema.orders.id, schema.orderItems.orderId))
        .where(and(
          eq(schema.orders.userId, currentUserId),
          eq(schema.orders.status, "delivered"),
          eq(schema.orderItems.productId, product.id)
        ))
        .limit(1) : Promise.resolve([])
    ]);

    const productTags = JSON.parse(product.tags || "[]");

    // 3. Process Review Stats
    const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalReviews = 0;
    let sumRating = 0;

    reviewStatsRaw.forEach((row: any) => {
      const r = Number(row.rating);
      const c = Number(row.count);
      if (r >= 1 && r <= 5) {
        starCounts[r] = c;
        totalReviews += c;
        sumRating += (r * c);
      }
    });

    const stats = {
      averageRating: totalReviews > 0 ? Math.round((sumRating / totalReviews) * 10) / 10 : 0,
      totalReviews,
      distribution: [1, 2, 3, 4, 5].map(star => ({
        stars: star,
        count: starCounts[star],
        percentage: totalReviews > 0 ? Math.round((starCounts[star] / totalReviews) * 100) : 0
      }))
    };

    // 4. Smart Scoring Logic for Related Products
    const scoredRelated = candidates.map((p: any) => {
      let score = 0;
      if (p.categoryId === product.categoryId) score += 10;
      const pTags = JSON.parse(p.tags || "[]");
      const tagMatches = pTags.filter((t: string) => productTags.includes(t)).length;
      score += tagMatches * 5;
      if (recentlyViewedIds.includes(p.id)) score -= 5;
      score += (p.soldCount || 0) * 0.1;
      score += (p.rating || 0) * 2;
      const priceDiff = Math.abs(p.price - product.price) / product.price;
      if (priceDiff < 0.2) score += 5;
      return { ...p, score };
    })
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 4);

    // 5. Check Review Eligibility
    let canReview = false;
    let reviewRestrictionReason = "Login to write a review";
    
    if (currentUserId) {
      if (userOrder && userOrder.length > 0) {
        const [existingReview] = await db.select().from(schema.reviews)
          .where(and(eq(schema.reviews.userId, currentUserId), eq(schema.reviews.productId, product.id)))
          .limit(1);
        
        if (existingReview) {
          canReview = false;
          reviewRestrictionReason = "You have already reviewed this product";
        } else {
          canReview = true;
          reviewRestrictionReason = "";
        }
      } else {
        canReview = false;
        reviewRestrictionReason = "Only verified purchasers can leave a review";
      }
    }

    return c.json({
      product: { ...product, _links: formatLinks(c, "/products", product.id) },
      relatedProducts: scoredRelated.map((r: any) => ({ ...r, _links: formatLinks(c, "/products", r.id) })),
      reviews: { items: reviews, stats },
      canReview,
      reviewRestrictionReason
    });

  } catch (error: any) {
    console.error("Bulk fetch error:", error.message);
    return c.json({ error: "Failed to fetch bulk data" }, 500);
  }
});

productsRouter.get("/by-slug/:slug", async (c) => {
  const slug = c.req.param("slug");
  const db = c.get("db");

  const [product] = await db.select().from(schema.products).where(eq(schema.products.slug, slug));
  if (!product) {
    return c.json({ error: "Product not found" }, 404);
  }

  return c.json({
    ...product,
    _links: formatLinks(c, "/products", product.id)
  });
});

productsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.get("db");

  const [product] = await db.select().from(schema.products).where(eq(schema.products.id, id));
  if (!product) throw new Error(`Product with ID ${id} not found`);

  return c.json({
    ...product,
    _links: formatLinks(c, "/products", id)
  });
});

productsRouter.post("/", async (c) => {
  const db = c.get("db");
  const body = await c.req.json().catch(() => null);

  if (!body?.title || !body?.price) {
    throw new Error("VAL: Title and price are required fields.");
  }

  const id = crypto.randomUUID();
  const slug = body.title.toLowerCase().replace(/ /g, "-") + "-" + id.slice(0, 5);

  await db.insert(schema.products).values({
    id,
    title: body.title,
    slug: body.slug || slug,
    categoryId: body.categoryId || null,
    brand: body.brand || "Generic",
    price: Number(body.price),
    salePrice: body.salePrice ? Number(body.salePrice) : null,
    stock: Number(body.stock) || 0,
    images: body.images ? (typeof body.images === 'string' ? body.images : JSON.stringify(body.images)) : "[]",
    tags: body.tags ? (typeof body.tags === 'string' ? body.tags : JSON.stringify(body.tags)) : "[]",
    overview: body.overview || null,
    specification: body.specification || null,
    highlights: body.highlights ? (typeof body.highlights === 'string' ? body.highlights : JSON.stringify(body.highlights)) : null,
    howItWorks: body.howItWorks ? (typeof body.howItWorks === 'string' ? body.howItWorks : JSON.stringify(body.howItWorks)) : null,
    benefits: body.benefits ? (typeof body.benefits === 'string' ? body.benefits : JSON.stringify(body.benefits)) : null,
    videoUrl: body.videoUrl || null,
    faqs: body.faqs ? (typeof body.faqs === 'string' ? body.faqs : JSON.stringify(body.faqs)) : null,
    specSheetUrl: body.specSheetUrl || null,
    comparisonData: body.comparisonData ? (typeof body.comparisonData === 'string' ? body.comparisonData : JSON.stringify(body.comparisonData)) : null,
    bundleProducts: body.bundleProducts ? (typeof body.bundleProducts === 'string' ? body.bundleProducts : JSON.stringify(body.bundleProducts)) : null,
    qna: body.qna ? (typeof body.qna === 'string' ? body.qna : JSON.stringify(body.qna)) : null,
    deliveryInfo: body.deliveryInfo || null,
    warrantyInfo: body.warrantyInfo || null,
    offerDeadline: body.offerDeadline ? new Date(body.offerDeadline) : null,
    trustBadges: body.trustBadges ? (typeof body.trustBadges === 'string' ? body.trustBadges : JSON.stringify(body.trustBadges)) : null,
    rating: 0,
    reviewCount: 0,
    soldCount: body.soldCount || 0,
    lowStockThreshold: body.lowStockThreshold !== undefined ? Number(body.lowStockThreshold) : 5,
    isActive: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await invalidateHomeCache(db, schema);

  return c.json({
    id,
    message: "Product created successfully",
    _links: formatLinks(c, "/products", id)
  }, 201);
});

productsRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.get("db");
  const body = await c.req.json();

  const [existing] = await db.select().from(schema.products).where(eq(schema.products.id, id));
  if (!existing) throw new Error(`Product with ID ${id} not found`);

  await db.update(schema.products)
    .set({
      title: body.title ?? existing.title,
      slug: body.slug ?? existing.slug,
      categoryId: body.categoryId ?? existing.categoryId,
      brand: body.brand ?? existing.brand,
      price: body.price !== undefined ? Number(body.price) : existing.price,
      salePrice: body.salePrice !== undefined ? (body.salePrice ? Number(body.salePrice) : null) : existing.salePrice,
      stock: body.stock !== undefined ? Number(body.stock) : existing.stock,
      images: body.images !== undefined ? (typeof body.images === 'string' ? body.images : JSON.stringify(body.images)) : existing.images,
      tags: body.tags !== undefined ? (typeof body.tags === 'string' ? body.tags : JSON.stringify(body.tags)) : existing.tags,
      overview: body.overview !== undefined ? body.overview : existing.overview,
      specification: body.specification !== undefined ? body.specification : existing.specification,
      highlights: body.highlights !== undefined ? (typeof body.highlights === 'string' ? body.highlights : JSON.stringify(body.highlights)) : existing.highlights,
      howItWorks: body.howItWorks !== undefined ? (typeof body.howItWorks === 'string' ? body.howItWorks : JSON.stringify(body.howItWorks)) : existing.howItWorks,
      benefits: body.benefits !== undefined ? (typeof body.benefits === 'string' ? body.benefits : JSON.stringify(body.benefits)) : existing.benefits,
      videoUrl: body.videoUrl !== undefined ? body.videoUrl : existing.videoUrl,
      faqs: body.faqs !== undefined ? (typeof body.faqs === 'string' ? body.faqs : JSON.stringify(body.faqs)) : existing.faqs,
      specSheetUrl: body.specSheetUrl !== undefined ? body.specSheetUrl : existing.specSheetUrl,
      comparisonData: body.comparisonData !== undefined ? (typeof body.comparisonData === 'string' ? body.comparisonData : JSON.stringify(body.comparisonData)) : existing.comparisonData,
      bundleProducts: body.bundleProducts !== undefined ? (typeof body.bundleProducts === 'string' ? body.bundleProducts : JSON.stringify(body.bundleProducts)) : existing.bundleProducts,
      qna: body.qna !== undefined ? (typeof body.qna === 'string' ? body.qna : JSON.stringify(body.qna)) : existing.qna,
      deliveryInfo: body.deliveryInfo !== undefined ? body.deliveryInfo : existing.deliveryInfo,
      warrantyInfo: body.warrantyInfo !== undefined ? body.warrantyInfo : existing.warrantyInfo,
      offerDeadline: body.offerDeadline !== undefined ? (body.offerDeadline ? new Date(body.offerDeadline) : null) : existing.offerDeadline,
      trustBadges: body.trustBadges !== undefined ? (typeof body.trustBadges === 'string' ? body.trustBadges : JSON.stringify(body.trustBadges)) : existing.trustBadges,
      soldCount: body.soldCount !== undefined ? Number(body.soldCount) : existing.soldCount,
      lowStockThreshold: body.lowStockThreshold !== undefined ? Number(body.lowStockThreshold) : existing.lowStockThreshold,
      isActive: body.isActive !== undefined ? (body.isActive ? 1 : 0) : existing.isActive,
      updatedAt: new Date()
    })
    .where(eq(schema.products.id, id));

  await invalidateHomeCache(db, schema);

  return c.json({
    message: "Product updated successfully",
    _links: formatLinks(c, "/products", id)
  });
});

productsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.get("db");

  await db.delete(schema.products).where(eq(schema.products.id, id));
  await invalidateHomeCache(db, schema);
  return c.body(null, 204);
});

productsRouter.post("/interactions", async (c) => {
  const db = c.get("db");
  const body = await c.req.json();
  const { productId, type, userId, sessionId } = body;

  if (!productId || !type) return c.json({ error: "Missing data" }, 400);

  const weight = type === 'purchase' ? 10 : type === 'add_to_cart' ? 3 : 1;

  await db.insert(schema.userInteractions).values({
    id: crypto.randomUUID(),
    productId,
    interactionType: type,
    userId: userId || null,
    sessionId: sessionId || null,
    weight,
    createdAt: new Date()
  });

  return c.json({ success: true });
});
