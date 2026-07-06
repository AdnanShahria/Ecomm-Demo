
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import * as schema from "../../../backend/server/db/schema";
import type { Bindings, Variables } from "../types";
import { invalidateCache } from "../utils/cache";

export const systemRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// 1. Refresh Global Cache
systemRouter.post("/refresh-cache", async (c) => {
  const db = c.get("db");
  
  try {
    // Invalidate the edge cache
    await invalidateCache("home_bulk");
    
    // Also invalidate the database fallback just in case
    await db.delete(schema.systemCache).where(eq(schema.systemCache.key, "home_bulk"));

    return c.json({ success: true, message: "Cache refreshed successfully" });
  } catch (error: any) {
    console.error("Cache Refresh Error:", error);
    return c.json({ error: "Failed to refresh cache" }, 500);
  }
});

// 2. Get Cache Status
systemRouter.get("/cache-status", async (c) => {
  const db = c.get("db");
  const cache = await db.select().from(schema.systemCache);
  return c.json(cache);
});

// 3. Proxy Image Upload
systemRouter.post("/upload-image", async (c) => {
  const apiKey = c.env.IMGBB_API_KEY;
  if (!apiKey) {
    return c.json({ error: "InternalServerError", message: "ImgBB API key not configured" }, 500);
  }

  try {
    const body = await c.req.parseBody();
    const image = body['image'];
    
    if (!image || !(image instanceof File)) {
      return c.json({ error: "ValidationError", message: "Valid image file is required" }, 400);
    }

    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json() as any;

    if (data.success) {
      return c.json({ url: data.data.url });
    } else {
      console.error("ImgBB upload failed:", data);
      return c.json({ error: "InternalServerError", message: "ImgBB upload failed" }, 500);
    }
  } catch (error) {
    console.error("Upload proxy error:", error);
    return c.json({ error: "InternalServerError", message: "An error occurred during upload proxy" }, 500);
  }
});
