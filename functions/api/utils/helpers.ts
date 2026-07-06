import { eq } from "drizzle-orm";

export const formatLinks = (c: any, path: string, id?: string) => {
  const baseUrl = new URL(c.req.url).origin + "/api/v1";
  const self = id ? `${baseUrl}${path}/${id}` : `${baseUrl}${path}`;
  return {
    self,
    collection: id ? `${baseUrl}${path}` : undefined,
  };
};

export const createPaginatedResponse = (
  items: any[],
  total: number,
  page: number,
  limit: number,
  links: any
) => {
  const pages = Math.ceil(total / limit);
  return {
    items,
    pagination: {
      total,
      page,
      limit,
      pages,
      has_next: page < pages,
      has_prev: page > 1,
    },
    _links: links,
  };
};

export const invalidateHomeCache = async (db: any, schema: any) => {
  try {
    await db.delete(schema.systemCache).where(eq(schema.systemCache.key, "home_bulk"));
  } catch (err) {
    console.error("Cache Invalidation Error:", err);
  }
};

/**
 * Fetches and structures home page data (banners, categories, products, popups).
 * Shared between bulkRouter and systemRouter.
 */
export const fetchHomeBulkData = async (db: any, schema: any) => {
  const [banners, categories, newProducts, popularProducts, bestSelling, [popup]] = await Promise.all([
    db.select().from(schema.banners).where(eq(schema.banners.isActive, 1)),
    db.select().from(schema.categories).where(eq(schema.categories.isActive, 1)),
    db.query.products.findMany({ 
      where: (p: any, { eq }: any) => eq(p.isActive, 1),
      limit: 8, 
      orderBy: (p: any, { desc }: any) => [desc(p.createdAt)] 
    }),
    db.query.products.findMany({ 
      where: (p: any, { eq }: any) => eq(p.isActive, 1),
      limit: 8, 
      orderBy: (p: any, { desc }: any) => [desc(p.rating)] 
    }),
    db.query.products.findMany({ 
      where: (p: any, { eq }: any) => eq(p.isActive, 1),
      limit: 8, 
      orderBy: (p: any, { desc }: any) => [desc(p.soldCount)] 
    }),
    db.select().from(schema.popupSettings).where(eq(schema.popupSettings.isActive, 1)).limit(1)
  ]);

  const normalizePosition = (p: string | null) => p?.toLowerCase().trim() || "";

  return {
    banners: {
      hero: banners.filter((b: any) => normalizePosition(b.position) === 'hero').sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)),
      mid1: banners.filter((b: any) => normalizePosition(b.position) === 'mid-1').sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)),
      mid2: banners.filter((b: any) => normalizePosition(b.position) === 'mid-2').sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)),
    },
    categories: { items: categories },
    products: {
      trending: { items: popularProducts },
      newArrivals: { items: newProducts },
      specialOffers: { items: newProducts.filter((p: any) => p.salePrice !== null) },
      bestSelling: { items: bestSelling },
      flashSales: { items: [] },
    },
    popup: popup || null,
    notifications: { items: [] },
    timestamp: new Date().toISOString()
  };
};
