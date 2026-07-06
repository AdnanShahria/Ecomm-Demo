// ── Addresses ────────────────────────────────────────
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const addresses = sqliteTable("addresses", {
  id:         text("id").primaryKey(),
  userId:     text("user_id").notNull(),
  label:      text("label"),              // "Home", "Office", etc.
  fullName:   text("full_name").notNull(),
  phone:      text("phone").notNull(),
  address:    text("address").notNull(),
  city:       text("city"),
  postalCode: text("postal_code"),
  isDefault:  integer("is_default").default(0),
  createdAt:  integer("created_at", { mode: "timestamp" }),
}, (table) => {
  return {
    userIdIdx: index("address_user_idx").on(table.userId),
  };
});
