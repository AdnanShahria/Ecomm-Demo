import axios from "axios";
import type { Banner, Product, Category, User, Address, Review, ReviewStats, ReturnRequest, HomeBulkResponse, UserBulkResponse, PopupSettings, Order } from "../types";
import { getCached, setCache, getInflight, setInflight, invalidate, getResourceBase } from "./apiCache";



import { ENV } from "../config/env_proxy";

const api = axios.create({
  // In dev: Cloudflare Pages dev server proxies /api → Hono
  // In prod: same origin, no CORS issue
  baseURL: ENV.API_BASE_URL,
  timeout: 20000,
});

// Add request interceptor for auth — prefer JWT from authStore, fall back to admin API key
api.interceptors.request.use((config) => {
  // Try to get JWT token from localStorage (Zustand persist)
  try {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      const token = parsed?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      }
    }
  } catch {
    // Ignore parsing errors
  }

  return config;
});

// ─── Cache Invalidation on Mutations ────────────────────
// When a POST/PATCH/DELETE succeeds, invalidate cached GETs for that resource
api.interceptors.response.use((response) => {
  const method = response.config.method;
  if (method && ['post', 'patch', 'put', 'delete'].includes(method)) {
    const url = `${response.config.baseURL}${response.config.url}`;
    const base = getResourceBase(url);
    invalidate(base);
    
    // Broaden invalidation for user data if related resources change
    if (base.includes('/orders') || base.includes('/addresses') || base.includes('/reviews') || base.includes('/wallet')) {
      invalidate('/api/v1/bulk/user');
    }
  }
  return response;
}, (error) => {
  const isDemoError = 
    (error.response?.status === 403 || error.response?.status === 401) && 
    (error.response?.data?.message?.includes("Demo Mode") || error.response?.data?.message?.includes("API key") || !error.response?.data?.message);

  if (isDemoError) {
    // Dynamically import the store to show the demo mode modal
    import('../store/uiStore').then(({ useUIStore }) => {
      useUIStore.getState().setShowDemoModeModal(true);
    });
    
    return Promise.reject({ ...error, isDemoMode: true });
  }
  return Promise.reject(error);
});

// ─── Cached GET Wrapper ──────────────────────────────────
// Replaces api.get with a version that has:
//  1) In-memory TTL cache (30s) — instant returns for repeated reads
//  2) In-flight deduplication — concurrent identical GETs share one request

const _rawGet = api.get.bind(api);

function buildCacheKey(url: string, params?: Record<string, string | number | boolean | null>): string {
  let key = `/api/v1${url}`;
  if (params && Object.keys(params).length > 0) {
    const sorted = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
    key += '?' + sorted.map(([k, v]) => `${k}=${v}`).join('&');
  }
  return key;
}

interface CustomGetConfig {
  params?: Record<string, string | number | boolean | null>;
  bypassCache?: boolean;
}

api.get = (async function cachedGet(url: string, config?: CustomGetConfig): Promise<unknown> {
  const cacheKey = buildCacheKey(url, config?.params);

  // 1. Return from memory cache if fresh (unless bypassed)
  const cached = config?.bypassCache ? null : getCached(cacheKey);
  if (cached) {
    return { data: cached, status: 200, statusText: 'OK (cached)', headers: {}, config: config || {} };
  }

  // 2. Deduplicate: if an identical GET is already in-flight, wait for it
  const inflight = getInflight(cacheKey);
  if (inflight) {
    const data = await inflight;
    return { data, status: 200, statusText: 'OK (deduped)', headers: {}, config: config || {} };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responsePromise = _rawGet(url, config as any);

  const dataPromise = responsePromise.then((res: { data: unknown }) => {
    setCache(cacheKey, res.data); // cache on success
    return res.data;
  }).catch((err: unknown) => {
    // Don't cache errors, just propagate
    throw err;
  });

  setInflight(cacheKey, dataPromise);

  return responsePromise;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

// ─── Banners ─────────────────────────────────────────

export const getBanners = async (position?: string): Promise<Banner[]> => {
  const res = await api.get(`/banners${position ? `?position=${position}` : ""}`);
  return res.data.items;
};

export const createBanner = async (banner: Omit<Banner, "id">) => {
  const res = await api.post("/banners", banner);
  return res.data;
};

export const updateBanner = async (id: string, banner: Partial<Banner>) => {
  const res = await api.patch(`/banners/${id}`, banner);
  return res.data;
};

export const deleteBanner = async (id: string) => {
  const res = await api.delete(`/banners/${id}`);
  return res.data;
};

// ─── Categories ──────────────────────────────────────

export const getCategories = async (featured = false, all = false): Promise<Category[]> => {
  const params = new URLSearchParams();
  if (featured) params.append('featured', 'true');
  if (all) params.append('all', 'true');
  
  const res = await api.get(`/categories?${params.toString()}`);
  return res.data.items;
};

export const createCategory = async (category: Partial<Category>) => {
  const res = await api.post("/categories", category);
  return res.data;
};

export const updateCategory = async (id: string, category: Partial<Category>) => {
  const res = await api.patch(`/categories/${id}`, category);
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};

// ─── Products ────────────────────────────────────────

export const getProducts = async (params: Record<string, string | number>) => {
  const res = await api.get("/products", { params });
  return res.data; // { items, pagination, _links }
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const res = await api.get(`/products/by-slug/${slug}`);
  return res.data;
};

export const getProductDetailsBulk = async (slug: string, recentlyViewedIds: string[] = [], userId?: string, logView: boolean = true): Promise<{
  product: Product;
  relatedProducts: Product[];
  reviews: { items: Review[]; stats: ReviewStats };
} | null> => {
  const ids = recentlyViewedIds.join(',');
  const res = await api.get(`/products/by-slug/${slug}/bulk?recentlyViewed=${ids}&logView=${logView}${userId ? `&userId=${userId}` : ''}`);
  return res.data;
};

export const logInteraction = async (productId: string, type: string, userId?: string, sessionId?: string) => {
  try {
    await api.post('/products/interactions', { productId, type, userId, sessionId });
  } catch (error) {
    console.error('Failed to log interaction:', error);
  }
};

export const searchProducts = async (q: string): Promise<Product[]> => {
  const res = await api.get(`/products/search?q=${q}`);
  return res.data.items;
};

export const createProduct = async (product: Partial<Product>) => {
  const res = await api.post("/products", product);
  return res.data;
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const res = await api.patch(`/products/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const syncTags = async (type: 'best-selling' | 'new-arrival', limit?: number) => {
  const res = await api.post("/products/sync-tags", { type, limit });
  return res.data;
};

// ─── Auth ────────────────────────────────────────────

export const registerUser = async (data: {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  fullName?: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: { username: string; password: string }) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const verifyOtp = async (data: { userId: string; code: string }) => {
  const res = await api.post("/auth/verify-otp", data);
  return res.data;
};

export const resendOtp = async (userId: string) => {
  const res = await api.post("/auth/resend-otp", { userId });
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (data: { email: string; code: string; newPassword: string }) => {
  const res = await api.post("/auth/reset-password", data);
  return res.data;
};

// ─── Users ───────────────────────────────────────────

export const getUserProfile = async (id: string): Promise<User> => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const updateUserProfile = async (id: string, data: Partial<User>) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

export const changePassword = async (id: string, data: { currentPassword: string; newPassword: string }) => {
  const res = await api.patch(`/users/${id}/password`, data);
  return res.data;
};

// ─── Addresses ───────────────────────────────────────

export const getAddresses = async (userId: string): Promise<Address[]> => {
  const res = await api.get(`/addresses?userId=${userId}`);
  return res.data.items;
};

export const createAddress = async (address: Omit<Address, "id" | "createdAt">) => {
  const res = await api.post("/addresses", address);
  return res.data;
};

export const updateAddress = async (id: string, address: Partial<Address>) => {
  const res = await api.patch(`/addresses/${id}`, address);
  return res.data;
};

export const deleteAddress = async (id: string) => {
  const res = await api.delete(`/addresses/${id}`);
  return res.data;
};

// ─── Reviews ─────────────────────────────────────────

export const getProductReviews = async (
  productId: string, 
  sort?: "latest" | "helpful", 
  hasImages?: boolean
): Promise<{ items: Review[]; stats: ReviewStats | null }> => {
  const params = new URLSearchParams({ productId });
  if (sort) params.append('sort', sort);
  if (hasImages) params.append('hasImages', 'true');
  const res = await api.get(`/reviews?${params.toString()}`);
  return res.data;
};

export const markReviewHelpful = async (id: string) => {
  const res = await api.patch(`/reviews/${id}/helpful`);
  return res.data;
};

export const getUserReviews = async (userId: string): Promise<Review[]> => {
  const res = await api.get(`/reviews?userId=${userId}`);
  return res.data.items;
};

export const submitReview = async (data: {
  productId: string;
  userId: string;
  username: string;
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
  orderId?: string;
}) => {
  const res = await api.post("/reviews", data);
  return res.data;
};

export const updateReview = async (id: string, data: Partial<Review>) => {
  const res = await api.patch(`/reviews/${id}`, data);
  return res.data;
};

export const deleteReview = async (id: string) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};

// ─── Returns & Cancellations ─────────────────────────

export const getReturns = async (userId: string, type?: 'return' | 'cancellation'): Promise<ReturnRequest[]> => {
  const params = new URLSearchParams({ userId });
  if (type) params.append('type', type);
  const res = await api.get(`/returns?${params.toString()}`);
  return res.data.items;
};

export const submitReturn = async (data: {
  orderId: string;
  userId: string;
  reason: string;
  type: 'return' | 'cancellation';
  details?: string;
  images?: string[];
}) => {
  const res = await api.post("/returns", data);
  return res.data;
};

// ─── Orders ──────────────────────────────────────────────
export const createOrder = async (data: Partial<Order>) => {
  const res = await api.post("/orders", data);
  return res.data;
};

export const cancelOrder = async (orderId: string, reason?: string) => {
  const res = await api.post(`/orders/${orderId}/cancel`, { reason });
  return res.data;
};

// ─── Wallet ──────────────────────────────────────────────
export const getWallet = async (userId: string) => {
  const res = await api.get(`/wallet?userId=${userId}`);
  return res.data;
};

export const topupWallet = async (data: { userId: string; amount: number; reference?: string }) => {
  const res = await api.post("/wallet/topup", data);
  return res.data;
};

export const chargeWallet = async (data: { userId: string; amount: number; reference?: string }) => {
  const res = await api.post("/wallet/charge", data);
  return res.data;
};

// ─── Bulk Fetch ──────────────────────────────────────────
export const getHomeBulk = async (): Promise<HomeBulkResponse> => {
  const res = await api.get("/bulk/home");
  return res.data;
};

export const getUserBulk = async (userId: string, customerName?: string, email?: string | null, bypassCache = false): Promise<UserBulkResponse> => {
  const params = new URLSearchParams({ userId });
  if (customerName) params.append('customerName', customerName);
  if (email) params.append('email', email);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = (await api.get(`/bulk/user?${params.toString()}`, { bypassCache } as any)) as { data: UserBulkResponse };
  return res.data;
};

// ─── Popup Settings ─────────────────────────────────────
export const getPopupSettings = async (): Promise<PopupSettings> => {
  const res = await api.get("/popup");
  return res.data;
};

export const updatePopupSettings = async (settings: Partial<PopupSettings>) => {
  const res = await api.put("/popup", settings);
  return res.data;
};

// ─── Newsletter ─────────────────────────────────────────
export const subscribeNewsletter = async (email: string, source: string = "footer") => {
  const res = await api.post("/newsletter/subscribe", { email, source });
  return res.data;
};

// ─── System ─────────────────────────────────────────────
export const refreshCache = async () => {
  const res = await api.post("/system/refresh-cache");
  return res.data;
};

export default api;
