import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const reviews = sqliteTable("reviews", {
  id:         text("id").primaryKey(),
  productId:  text("product_id").notNull(),
  userId:     text("user_id").notNull(),
  username:   text("username").notNull(),
  rating:     integer("rating").notNull(),          // 1-5
  title:      text("title"),
  content:    text("content"),
  images:     text("images"),                       // JSON string → string[]
  isVerified: integer("is_verified").default(0),    // Verified Purchase badge
  orderId:    text("order_id"),                      // Link to specific order
  helpfulCount: integer("helpful_count").default(0),
  status:     text("status").default("approved"),   // "pending" | "approved" | "flagged" | "rejected"
  createdAt:  integer("created_at", { mode: "timestamp" }),
}, (table) => {
  return {
    productIdx: index("review_product_idx").on(table.productId),
    userIdIdx: index("review_user_idx").on(table.userId),
    statusIdx: index("review_status_idx").on(table.status),
    productStatusIdx: index("review_product_status_idx").on(table.productId, table.status),
  };
});
