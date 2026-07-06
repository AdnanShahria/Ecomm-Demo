
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../server/db/schema";
import { sql, eq } from "drizzle-orm";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config({ path: ".dev.vars" });

const firstNames = ["Adnan", "Adib", "Zayan", "Abrar", "Sami", "Tarik", "Nabil", "Fahim", "Rahat", "Tanvir", "Siam", "Anika", "Sumaiya", "Nusrat", "Farhana", "Maliha", "Raisa", "Sajid", "Ahsan", "Kamal", "Raihan", "Kabir", "Asif", "Zubair", "Irfan"];
const lastNames = ["Shahria", "Ahmed", "Hasan", "Khan", "Chowdhury", "Islam", "Rahman", "Kabir", "Uddin", "Mahmud", "Ali", "Hossain", "Talukder", "Miah", "Sarker"];
const areas = ["Mirpur 10", "Dhanmondi 32", "Uttara Sector 7", "Banani Road 11", "Gulshan 2", "Mohammadpur", "Badda", "Bashundhara R/A", "Malibagh", "Farmgate", "Lalmatia", "Niketan", "Baridhara", "Khilgaon", "Moghbazar"];
const roadTypes = ["Road", "Lane", "Avenue", "Street", "Block"];
const courierPrefixes = ["PATHAO", "STEADFAST", "REDX", "PAPERFLY"];
const internalNotes = [
  "Customer called for fast delivery.",
  "Check packaging for fragile item.",
  "Gift wrap requested.",
  "Call before 10 AM.",
  "Alternative number: 018XXXXXXXX",
  "High priority customer.",
  "Leave at reception if not available.",
  "Verified via bKash.",
  "Regular customer, discount applied.",
  "Awaiting stock for one item."
];

const getRand = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getFullName = () => `${getRand(firstNames)} ${getRand(lastNames)}`;
const getEmail = (name: string) => `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`;
const getUniqueEmail = (name: string, i: number) => `${name.toLowerCase().replace(/\s+/g, ".")}.${i + 100}@example.com`;
const getAddress = () => `${Math.floor(Math.random() * 150) + 1}, ${getRand(roadTypes)} ${Math.floor(Math.random() * 30) + 1}, ${getRand(areas)}, Dhaka`;
const getPhone = () => `01${getRand(["3", "5", "6", "7", "8", "9"])}${Math.floor(10000000 + Math.random() * 90000000)}`;

async function main() {
  const url = process.env.TURSO_URL || "file:dev.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  console.log(`🚀 Connecting to database at: ${url}`);

  const client = createClient({
    url,
    authToken,
  });
  const db = drizzle(client, { schema });

  console.log("🧹 Clearing old data for a fresh genuine start...");
  await db.delete(schema.trackings);
  await db.delete(schema.orderItems);
  await db.delete(schema.orders);
  await db.delete(schema.addresses);
  await db.delete(schema.users);
  await db.delete(schema.userInteractions);
  await db.delete(schema.productSales);
  await db.delete(schema.adminLogs);
  await db.delete(schema.notifications);
  await db.delete(schema.walletTransactions);
  await db.delete(schema.returns);

  // 1. Seed Categories
  console.log("📂 Seeding genuine categories...");
  const categoriesData = [
    { id: "cat-1", name: "Playpens", slug: "playpens", description: "Safe and spacious play areas for babies and toddlers." },
    { id: "cat-2", name: "Safety Gates", slug: "safety-gates", description: "Secure barriers for stairs, doorways, and hazardous areas." },
    { id: "cat-3", name: "Soft Mats", slug: "soft-mats", description: "Cushioned, non-toxic flooring for safe playtime." },
    { id: "cat-4", name: "Accessories", slug: "accessories", description: "Safety locks, monitors, and essential baby gear." },
  ];

  for (const cat of categoriesData) {
    await db.insert(schema.categories).values(cat).onConflictDoNothing();
  }

  // 2. Seed Products
  console.log("🛒 Seeding genuine products...");
  const productsData = [
    { id: "p-1", title: "Premium XL Baby Playpen", slug: "premium-xl-playpen", price: 12500, categoryId: "cat-1", stock: 15, images: JSON.stringify(["https://images.unsplash.com/photo-1620661103561-99b58de7982a?q=80&w=600"]), description: "Extra large safety playpen with breathable mesh and sturdy frame." },
    { id: "p-2", title: "Dual-Lock Safety Gate", slug: "standard-gate", price: 4800, categoryId: "cat-2", stock: 45, images: JSON.stringify(["https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600"]), description: "One-handed operation safety gate for stairs and doorways." },
    { id: "p-3", title: "Thick Non-Toxic Folding Mat", slug: "play-mat", price: 3500, categoryId: "cat-3", stock: 120, images: JSON.stringify(["https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=600"]), description: "Double-sided waterproof mat for toddlers." },
    { id: "p-4", title: "Universal Baby Monitor Mount", slug: "monitor-mount", price: 1800, categoryId: "cat-4", stock: 85, images: JSON.stringify(["https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=600"]), description: "Flexible arm mount compatible with most video monitors." },
    { id: "p-5", title: "Portable Travel Playpen", slug: "travel-playpen", price: 8900, categoryId: "cat-1", stock: 22, images: JSON.stringify(["https://images.unsplash.com/photo-1544126592-807daa2b5650?q=80&w=600"]), description: "Lightweight folding playpen for travel and outdoor use." },
    { id: "p-6", title: "Soft Corner Guards (12-Pack)", slug: "corner-guards", price: 650, categoryId: "cat-2", stock: 300, images: JSON.stringify(["https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=600"]), description: "Clear silicone corner protectors for sharp furniture." },
    { id: "p-7", title: "Musical Crib Mobile", slug: "musical-mobile", price: 3200, categoryId: "cat-4", stock: 40, images: JSON.stringify(["https://images.unsplash.com/photo-1591035897819-f4bdf739f446?q=80&w=600"]), description: "Rotating mobile with soothing melodies and plush toys." },
    { id: "p-8", title: "Baby Knee Pads for Crawling", slug: "knee-pads", price: 450, categoryId: "cat-4", stock: 500, images: JSON.stringify(["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600"]), description: "Breathable cotton knee protectors with anti-slip beads." }
  ];

  for (const prod of productsData) {
    await db.insert(schema.products).values({
      ...prod,
      isActive: 1,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    }).onConflictDoNothing();
  }

  const allProducts = await db.query.products.findMany();
  const productIds = allProducts.map(p => p.id);

  // 3. Seed Users & Addresses
  console.log("👤 Seeding genuine users and addresses...");
  const usersToCreate = 50;
  const userIds: string[] = [];
  const userMap = new Map<string, any>();
  const now = new Date();

  for (let i = 0; i < usersToCreate; i++) {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    createdAt.setMonth(now.getMonth() - Math.floor(Math.random() * 6));
    createdAt.setDate(Math.floor(Math.random() * 28) + 1);

    const role = i === 0 ? "admin" : "user";
    const fullName = i === 0 ? "Adnan Shahria" : getFullName();
    const email = i === 0 ? "admin@aurelia.com" : getUniqueEmail(fullName, i);
    const phone = getPhone();

    await db.insert(schema.users).values({
      id,
      username: i === 0 ? "admin" : `user_${i}_${Math.floor(Math.random() * 1000)}`,
      email,
      fullName,
      phone,
      passwordHash: "dummy_hash",
      role,
      isVerified: 1,
      createdAt
    });
    
    // Seed 1-2 Addresses for this user
    const addrCount = Math.random() > 0.8 ? 2 : 1;
    const addresses = [];
    for (let j = 0; j < addrCount; j++) {
      const addressStr = getAddress();
      const addressId = crypto.randomUUID();
      await db.insert(schema.addresses).values({
        id: addressId,
        userId: id,
        label: j === 0 ? "Home" : "Office",
        fullName,
        phone,
        address: addressStr,
        city: "Dhaka",
        postalCode: "12" + (Math.floor(Math.random() * 20) + 10),
        isDefault: j === 0 ? 1 : 0,
        createdAt
      });
      addresses.push(addressStr);
    }

    userIds.push(id);
    userMap.set(id, { fullName, email, phone, address: addresses[0] });
  }

  // 4. Seed Orders
  console.log("📈 Seeding genuine orders and trackings...");
  const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  const paymentMethods = ["cod", "bkash", "nagad", "wallet"];
  const ordersCount = 200;

  for (let i = 0; i < ordersCount; i++) {
    const orderId = crypto.randomUUID();
    const invoiceId = `T-INV-${Math.floor(100000 + Math.random() * 900000)}-${i}`;
    const userId = getRand(userIds);
    const user = userMap.get(userId);
    
    const date = new Date();
    const monthsAgo = Math.floor(Math.pow(Math.random(), 2) * 12); 
    date.setMonth(now.getMonth() - monthsAgo);
    date.setDate(Math.floor(Math.random() * 28) + 1);
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

    const status = i < 15 ? "Pending" : getRand(statuses);
    const paymentMethod = getRand(paymentMethods);
    const courierId = (status === "Shipped" || status === "Delivered") ? `${getRand(courierPrefixes)}-${Math.floor(100000 + Math.random() * 900000)}` : null;
    const courierLink = courierId ? `https://track.pathao.com/track/${courierId}` : null;
    const internalNote = Math.random() > 0.6 ? getRand(internalNotes) : null;

    const itemCount = Math.floor(Math.random() * 3) + 1;
    let totalAmount = 0;
    const items = [];

    for (let j = 0; j < itemCount; j++) {
      const product = getRand(allProducts);
      const quantity = Math.floor(Math.random() * 2) + 1;
      const price = product.price || 5000;
      totalAmount += price * quantity;
      items.push({ id: crypto.randomUUID(), orderId, productId: product.id, quantity, price });
    }

    // Insert Order
    await db.insert(schema.orders).values({
      id: orderId,
      invoiceId,
      userId,
      customerName: user.fullName,
      customerEmail: user.email,
      customerPhone: user.phone,
      shippingAddress: user.address,
      totalAmount,
      status,
      paymentMethod,
      paymentPhone: paymentMethod !== 'cod' ? user.phone : null,
      paymentTrxId: paymentMethod !== 'cod' ? crypto.randomBytes(4).toString('hex').toUpperCase() : null,
      internalNote,
      courierId,
      courierLink,
      createdAt: date,
    });

    // Seed Trackings
    const statusOrder = ["Pending", "Processing", "Shipped", "Delivered"];
    let steps = statusOrder.indexOf(status);
    if (status === "Cancelled") steps = 0;

    if (steps !== -1) {
      for (let j = 0; j <= steps; j++) {
        const trackingDate = new Date(date.getTime() + j * (Math.random() * 24 + 6) * 60 * 60 * 1000);
        await db.insert(schema.trackings).values({
          id: crypto.randomUUID(),
          orderId,
          status: statusOrder[j],
          message: j === 0 ? "Order received and pending verification." : 
                   j === 1 ? "Order is being packed at our warehouse." :
                   j === 2 ? `Handed over to ${courierId?.split('-')[0] || 'courier'}.` :
                   "Delivered successfully. Thank you!",
          location: j > 1 ? "In Transit" : "Dhaka Hub",
          createdAt: trackingDate
        });
      }
      if (status === "Cancelled") {
        await db.insert(schema.trackings).values({
          id: crypto.randomUUID(),
          orderId,
          status: "Cancelled",
          message: "Order cancelled by customer.",
          location: "System",
          createdAt: new Date(date.getTime() + 2 * 60 * 60 * 1000)
        });
      }
    }

    // Order Items & Product Sales
    for (const item of items) {
      await db.insert(schema.orderItems).values(item);
      await db.insert(schema.productSales).values({
        id: crypto.randomUUID(),
        productId: item.productId,
        orderId,
        userId,
        customerName: user.fullName,
        customerPhone: user.phone,
        invoiceId,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        createdAt: date
      });
    }

    // Returns
    if (status === "Delivered" && Math.random() < 0.1) {
      await db.insert(schema.returns).values({
        id: crypto.randomUUID(),
        orderId,
        userId,
        reason: getRand(["Wrong size", "Slightly damaged", "Changed mind", "Not as described"]),
        status: "Completed",
        type: "return",
        createdAt: new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000)
      });
    }
  }

  // 5. Seed Interactions
  console.log("📊 Seeding traffic...");
  for (let i = 0; i < 800; i++) {
    const type = getRand(["view", "view", "view", "add_to_cart", "purchase"]) as any;
    const productId = getRand(productIds);
    const userId = Math.random() > 0.4 ? getRand(userIds) : null;
    const date = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);

    await db.insert(schema.userInteractions).values({
      id: crypto.randomUUID(),
      userId,
      sessionId: crypto.randomUUID(),
      productId,
      interactionType: type,
      weight: type === "purchase" ? 10 : type === "add_to_cart" ? 3 : 1,
      createdAt: date
    });
  }

  // 6. Notifications & Admin Logs
  console.log("📝 Seeding system logs and notifications...");
  const adminId = userIds[0];
  for (let i = 0; i < 60; i++) {
    const action = getRand([
      { action: "order.approve", entity: "order" },
      { action: "order.ship", entity: "order" },
      { action: "product.update", entity: "product" },
      { action: "user.block", entity: "user" },
      { action: "inventory.restock", entity: "product" }
    ]);
    await db.insert(schema.adminLogs).values({
      id: crypto.randomUUID(),
      adminId,
      action: action.action,
      entity: action.entity,
      entityId: crypto.randomUUID(),
      details: `Admin performed ${action.action} on ${action.entity}`,
      ipAddress: `103.23.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    });
  }

  for (let i = 0; i < 40; i++) {
    const userId = getRand(userIds);
    await db.insert(schema.notifications).values({
      id: crypto.randomUUID(),
      userId,
      title: "Order Update",
      message: "Your order has been updated to " + getRand(statuses),
      type: "order",
      isRead: Math.random() > 0.5 ? 1 : 0,
      createdAt: new Date(now.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  console.log("✅ Genuine Seed Data Created Successfully!");
  process.exit(0);
}

main().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
