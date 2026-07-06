// Environment Variable Proxy
// This file centralizes all frontend configuration.
// Sensitive keys have been moved to the backend and are accessed via proxy endpoints.

export const ENV = {
  API_BASE_URL: (import.meta.env.VITE_API_URL || "") + "/api/v1",
  
  // Other non-sensitive config can go here
};

console.log("[ENV] API_BASE_URL:", ENV.API_BASE_URL);
console.log("[ENV] VITE_API_URL raw:", import.meta.env.VITE_API_URL ?? "(not set)");
