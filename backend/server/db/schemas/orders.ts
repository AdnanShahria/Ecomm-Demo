import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const orders = sqliteTable("orders", {
  id:              text("id").primaryKey(),
  invoiceId:       text("invoice_id").unique(),
  userId:          text("user_id"),              // links to users table (nullable for guest checkout)
  customerName:    text("customer_name").notNull(),
  customerEmail:   text("customer_email"),
  customerPhone:   text("customer_phone").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  totalAmount:     real("total_amount").notNull(),
  status:          text("status").default("pending"), // pending, processing, shipped, delivered, cancelled
  paymentMethod:   text("payment_method").default("cod"), // cod, bkash, nagad, wallet
  paymentPhone:    text("payment_phone"), // phone number used to send money
  paymentTrxId:    text("payment_trx_id"), // bKash/Nagad transaction ID
  internalNote:    text("internal_note"), // admin-only notes
  courierId:       text("courier_id"),    // e.g. Pathao/Steadfast ID
  courierLink:     text("courier_link"),  // link to tracking
  createdAt:       integer("created_at", { mode: "timestamp" }),
}, (table) => {
  return {
    userIdIdx: index("order_user_id_idx").on(table.userId),
    customerNameIdx: index("order_customer_name_idx").on(table.customerName),
    customerEmailIdx: index("order_customer_email_idx").on(table.customerEmail),
    statusIdx: index("order_status_idx").on(table.status),
    createdAtIdx: index("order_created_at_idx").on(table.createdAt),
  };
});

export const orderItems = sqliteTable("order_items", {
  id:        text("id").primaryKey(),
  orderId:   text("order_id").notNull(),
  productId: text("product_id").notNull(),
  quantity:  integer("quantity").notNull(),
  price:     real("price").notNull(),
}, (table) => {
  return {
    orderIdIdx: index("order_item_order_id_idx").on(table.orderId),
    productIdIdx: index("order_item_product_id_idx").on(table.productId),
  };
});

export const trackings = sqliteTable("trackings", {
  id:        text("id").primaryKey(),
  orderId:   text("order_id").notNull(),
  status:    text("status").notNull(), // Order Placed, Processing, Shipped, Out for Delivery, Delivered
  message:   text("message"),
  location:  text("location"),
  createdAt: integer("created_at", { mode: "timestamp" }),
}, (table) => {
  return {
    orderIdIdx: index("tracking_order_id_idx").on(table.orderId),
  };
});

// ── Relations ──────────────────────────────────────────
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
  trackings: many(trackings),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const trackingsRelations = relations(trackings, ({ one }) => ({
  order: one(orders, {
    fields: [trackings.orderId],
    references: [orders.id],
  }),
}));
