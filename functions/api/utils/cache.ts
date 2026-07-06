/**
 * Cloudflare Edge Cache Utility
 * Uses the native Cache API in Cloudflare Workers to cache responses at the CDN edge.
 */

const CACHE_NAME = 'aurelia-super-cache';

// We use a dummy domain to construct standard Request objects for Cache API.
// This ensures cache hits work consistently regardless of the incoming request's host/domain.
const buildCacheKey = (key: string) => new Request(`https://super-cache.local/${key}`);

/**
 * Attempts to retrieve a parsed JSON object from the Edge Cache.
 */
export const getCachedResponse = async (key: string) => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(buildCacheKey(key));
    
    if (response) {
      return await response.json();
    }
    return null;
  } catch (error) {
    // Fails safely in environments where caches API is missing
    console.error('Edge Cache Match Error:', error);
    return null;
  }
};

/**
 * Stores a JSON object in the Edge Cache.
 * @param c - Hono context (used for waitUntil)
 * @param key - The cache key string (e.g., "home_bulk")
 * @param data - The object to cache
 * @param ttlSeconds - Cache TTL in seconds (default 1 hour)
 */
export const setCachedResponse = async (c: any, key: string, data: any, ttlSeconds: number = 3600) => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${ttlSeconds}`,
      }
    });

    const cachePromise = cache.put(buildCacheKey(key), response);

    // Run cache put in the background so it doesn't block the request
    if (c.executionCtx) {
      c.executionCtx.waitUntil(cachePromise);
    } else {
      await cachePromise;
    }
  } catch (error) {
    console.error('Edge Cache Put Error:', error);
  }
};

/**
 * Invalidates a specific key in the Edge Cache.
 */
export const invalidateCache = async (key: string) => {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.delete(buildCacheKey(key));
  } catch (error) {
    console.error('Edge Cache Delete Error:', error);
  }
};
