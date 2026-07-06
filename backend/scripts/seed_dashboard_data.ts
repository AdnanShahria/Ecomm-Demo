import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../server/db/schema";
import { sql } from "drizzle-orm";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config({ path: ".dev.vars" });

async function main() {
  const url = process.env.TURSO_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error("❌ TURSO_URL not found in .dev.vars");
    process.exit(1);
  }

  const client = createClient({
    url,
    authToken,
  });
  const db = drizzle(client, { schema });

  console.log("🚀 Seeding dashboard data (Orders & Revenue)...");

  // 1. Get some products to link orders to
  const products = await db.query.products.findMany({ limit: 10 });
  if (products.length === 0) {
    console.log("❌ No products found. Please seed products first.");
    process.exit(1);
  }

  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const paymentMethods = ["cod", "bkash", "nagad", "wallet"];
  const names = ["Adnan Shahria", "Karim Ahmed", "Sarah Khan", "John Doe", "Jane Smith", "Rahim Ali", "Fatima Zoya"];

  const ordersToCreate = 60; // 10 orders per month for 6 months
  const now = new Date();

  for (let i = 0; i < ordersToCreate; i++) {
    const orderId = crypto.randomUUID();
    const invoiceId = `INV-${2024000 + i}`;
    
    // Random date within the last 6 months
    const date = new Date();
    date.setMonth(now.getMonth() - Math.floor(Math.random() * 6));
    date.setDate(Math.floor(Math.random() * 28) + 1);
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const customerName = names[Math.floor(Math.random() * names.length)];

    // Create 1-3 items per order
    const itemCount = Math.floor(Math.random() * 3) + 1;
    let totalAmount = 0;
    const items = [];

    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 2) + 1;
      const price = product.price || 1500;
      totalAmount += price * quantity;

      items.push({
        id: crypto.randomUUID(),
        orderId,
        productId: product.id,
        quantity,
        price,
      });
    }

    // Insert Order
    await db.insert(schema.orders).values({
      id: orderId,
      invoiceId,
      customerName,
      customerPhone: "01700000000",
      shippingAddress: "Dhaka, Bangladesh",
      totalAmount,
      status: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize for frontend
      paymentMethod,
      createdAt: date,
    });

    // Insert Order Items
    for (const item of items) {
      await db.insert(schema.orderItems).values(item);
    }

    if (i % 10 === 0) console.log(`Created ${i} orders...`);
  }

  console.log("✅ Successfully seeded 60 orders with items!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
