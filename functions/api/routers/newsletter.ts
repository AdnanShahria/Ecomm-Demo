import { Hono } from "hono";
import { eq, desc, count } from "drizzle-orm";
import * as schema from "../../../backend/server/db/schema";
import type { Bindings, Variables } from "../types";

export const newsletterRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ── Public: Subscribe to newsletter ──────────────────────
newsletterRouter.post("/subscribe", async (c) => {
  try {
    const db = c.get("db");
    const body = await c.req.json().catch(() => null);

    if (!body?.email) throw new Error("VAL: Email is required.");

    const email = body.email.trim().toLowerCase();
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("VAL: Please provide a valid email address.");
    }

    // Check if already subscribed
    const [existing] = await db
      .select()
      .from(schema.newsletterLeads)
      .where(eq(schema.newsletterLeads.email, email));

    if (existing) {
      if (existing.isActive === 1) {
        return c.json({ message: "You're already subscribed!" });
      }
      // Re-subscribe
      await db
        .update(schema.newsletterLeads)
        .set({ isActive: 1, subscribedAt: new Date().toISOString(), unsubscribedAt: null })
        .where(eq(schema.newsletterLeads.id, existing.id));
      return c.json({ message: "Welcome back! You've been re-subscribed." });
    }

    // New subscription
    const id = crypto.randomUUID();
    await db.insert(schema.newsletterLeads).values({
      id,
      email,
      source: body.source || "footer",
      isActive: 1,
      subscribedAt: new Date().toISOString(),
    });

    return c.json({ message: "Successfully subscribed! 🎉" });
  } catch (error: any) {
    console.error("Newsletter subscribe error:", error.message);
    if (error.message.startsWith("VAL:")) throw error;
    return c.json({ error: "SubscribeError", message: error.message }, 500);
  }
});

// ── Admin: Get all newsletter leads ──────────────────────
newsletterRouter.get("/", async (c) => {
  try {
    const db = c.get("db");
    const leads = await db
      .select()
      .from(schema.newsletterLeads)
      .orderBy(desc(schema.newsletterLeads.subscribedAt));

    const [totalResult] = await db
      .select({ value: count() })
      .from(schema.newsletterLeads);

    const [activeResult] = await db
      .select({ value: count() })
      .from(schema.newsletterLeads)
      .where(eq(schema.newsletterLeads.isActive, 1));

    return c.json({
      items: leads,
      total: totalResult?.value || 0,
      activeCount: activeResult?.value || 0,
    });
  } catch (error: any) {
    console.error("Fetch newsletter leads error:", error.message);
    return c.json({ error: "FetchError", message: error.message }, 500);
  }
});

// ── Admin: Delete a lead ────────────────────────────────
newsletterRouter.delete("/:id", async (c) => {
  try {
    const db = c.get("db");
    const id = c.req.param("id");

    await db.delete(schema.newsletterLeads).where(eq(schema.newsletterLeads.id, id));
    return c.json({ message: "Lead deleted." });
  } catch (error: any) {
    console.error("Delete newsletter lead error:", error.message);
    return c.json({ error: "DeleteError", message: error.message }, 500);
  }
});

// ── Admin: Toggle subscription status ───────────────────
newsletterRouter.patch("/:id/toggle", async (c) => {
  try {
    const db = c.get("db");
    const id = c.req.param("id");

    const [lead] = await db
      .select()
      .from(schema.newsletterLeads)
      .where(eq(schema.newsletterLeads.id, id));

    if (!lead) throw new Error("Lead not found");

    const newStatus = lead.isActive === 1 ? 0 : 1;
    await db
      .update(schema.newsletterLeads)
      .set({
        isActive: newStatus,
        ...(newStatus === 0 ? { unsubscribedAt: new Date().toISOString() } : { unsubscribedAt: null }),
      })
      .where(eq(schema.newsletterLeads.id, id));

    return c.json({ message: `Lead ${newStatus === 1 ? "activated" : "deactivated"}.` });
  } catch (error: any) {
    console.error("Toggle newsletter lead error:", error.message);
    return c.json({ error: "ToggleError", message: error.message }, 500);
  }
});
