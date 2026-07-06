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

  const res = await client.execute("SELECT id, title, created_at FROM products LIMIT 10");
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit(0);
}

main().catch(console.error);
