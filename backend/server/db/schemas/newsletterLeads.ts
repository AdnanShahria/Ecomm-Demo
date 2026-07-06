// ── Newsletter Leads ────────────────────────────────────
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const newsletterLeads = sqliteTable("newsletter_leads", {
  id:           text("id").primaryKey(),
  email:        text("email").notNull().unique(),
  source:       text("source").default("footer"),       // "footer" | "popup" | "checkout"
  isActive:     integer("is_active").default(1),         // 1 = subscribed, 0 = unsubscribed
  subscribedAt: text("subscribed_at"),
  unsubscribedAt: text("unsubscribed_at"),
});
