import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const products = sqliteTable("products", {
  createdAt: integer("created_at", { mode: "timestamp" }),
});

async function test() {
  const client = createClient({ url: "file::memory:" });
  const db = drizzle(client);

  await client.execute("CREATE TABLE products (created_at INTEGER)");
  
  const now = new Date();
  
  // Insert using Drizzle
  await db.insert(products).values({
    createdAt: now
  });

  // Check raw value in DB
  const raw = await client.execute("SELECT created_at FROM products");
  console.log("Raw value in DB (Drizzle insert):", raw.rows[0].created_at);

  // Read back using Drizzle
  const res = await db.select().from(products);
  console.log("Drizzle read back:", res[0].createdAt?.toISOString());
  
  process.exit(0);
}

test();
