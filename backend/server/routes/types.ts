export type Bindings = {
  TURSO_URL: string;
  TURSO_AUTH_TOKEN: string;
  JWT_SECRET: string;
  ADMIN_API_KEY: string;
  GOOGLE_SCRIPT_URL: string;
};

export type Variables = {
  user?: {
    id: string;
    role: string;
  }
};
