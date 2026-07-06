import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    envDir: '../',
    plugins: [react(), tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    server: {
      port: 6900,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://127.0.0.1:6901",
          changeOrigin: true,
        },
      },
    },
  };
});
