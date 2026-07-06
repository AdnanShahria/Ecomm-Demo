import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".dev.vars" });

async function main() {
  const url = process.env.TURSO_URL || "file:dev.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  const client = createClient({
    url,
    authToken,
  });

  console.log("🛠️ Starting database timestamp cleanup...");

  const tablesToFix = [
    { table: "products", column: "created_at" },
    { table: "reviews", column: "created_at" },
    { table: "orders", column: "created_at" },
    { table: "addresses", column: "created_at" },
    { table: "users", column: "created_at" },
    { table: "notifications", column: "created_at" },
    { table: "admin_logs", column: "created_at" }
  ];

  for (const item of tablesToFix) {
    console.log(`Checking table: ${item.table}`);
    
    // Threshold: 100,000,000,000 (roughly year 5138)
    // Values larger than this are definitely milliseconds
    const res = await client.execute({
      sql: `UPDATE ${item.table} SET ${item.column} = ${item.column} / 1000 WHERE ${item.column} > 10000000000`,
      args: []
    });
    
    console.log(`  Updated rows in ${item.table}: ${res.rowsAffected}`);
  }

  console.log("✅ Timestamp cleanup completed!");
  process.exit(0);
}

main().catch(console.error);
