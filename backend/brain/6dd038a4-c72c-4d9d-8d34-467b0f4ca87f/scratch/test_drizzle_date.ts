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
  console.log("Current Date:", now.toISOString());
  console.log("Date.now():", Date.now());

  // Insert using raw SQL with Date.now() (ms)
  await client.execute({
    sql: "INSERT INTO products (created_at) VALUES (?)",
    args: [Date.now()]
  });

  // Read back using Drizzle
  const res = await db.select().from(products);
  console.log("Drizzle read back:", res[0].createdAt?.toISOString());
  
  process.exit(0);
}

test();
