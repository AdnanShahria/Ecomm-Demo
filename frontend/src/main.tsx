import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './styles/globals.css'
import App from './App.tsx'
import { useUIStore } from './store/uiStore'
import { ENV } from './config/env_proxy'

// Global Fetch Interceptor for Admin API calls (fixes missing headers in native fetch)
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const [url, config] = args;
  
  if (typeof url === 'string' && url.startsWith('/api/v1')) {
    const newConfig = { ...config } as RequestInit;
    newConfig.headers = { ...newConfig.headers } as Record<string, string>;
    
    // 1. Attach JWT Authorization if available
    try {
      const stored = localStorage.getItem('auth-storage');
      if (stored) {
        const token = JSON.parse(stored)?.state?.token;
        if (token) {
          newConfig.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch (e) {}

    // 2. Prepend API_BASE_URL (for production Cloudflare Pages compatibility)
    const newUrl = ENV.API_BASE_URL + url.replace('/api/v1', '');
    
    try {
      const response = await originalFetch(newUrl, newConfig);
      
      // 3. Catch Demo Mode 403 or Unauthorized 401
      if (response.status === 403 || response.status === 401) {
        const cloned = response.clone();
        cloned.json().then(data => {
          if (data?.message?.includes("Demo Mode") || data?.message?.includes("API key") || !data?.message) {
            useUIStore.getState().setShowDemoModeModal(true);
          }
        }).catch(() => {});
      }
      
      return response;
    } catch (err) {
      throw err;
    }
  }
  
  return originalFetch(...args);
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
