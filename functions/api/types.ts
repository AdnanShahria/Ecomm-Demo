import * as schema from "../../backend/server/db/schema";

export type Bindings = {
  TURSO_URL: string;
  TURSO_AUTH_TOKEN: string;
  ADMIN_API_KEY: string;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  IMGBB_API_KEY?: string;
  JWT_SECRET: string;
  GOOGLE_SCRIPT_URL: string;
  ADMIN_NOTIFICATION_EMAIL: string;
  EMAIL_WEBHOOK_SECRET: string;
  NODE_ENV?: string;
  DB_READ_ONLY?: string;
};

export type Variables = {
  db: import("drizzle-orm/libsql").LibSQLDatabase<typeof schema>;
};
