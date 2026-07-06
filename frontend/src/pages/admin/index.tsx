import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { getProducts, getCategories, getBanners, createBanner, updateBanner, deleteBanner, createProduct, updateProduct, deleteProduct, createCategory, updateCategory, deleteCategory } from '../../services/api';
import type { Product, Category, Banner } from '../../types';
import { Sidebar } from './Sidebar';
import { AdminNavbar } from './AdminNavbar';
import { BannerManager } from './BannerManager';
import { CategoryManager } from './CategoryManager';
import { ProductManager } from './ProductManager';
import { OrderManager } from './OrderManager';
import { AdminSettings } from './Settings';
import { AdminLogin } from './Login';
import { AdminDashboard } from './Dashboard';
import { CustomerManager } from './CustomerManager';
import { ReviewModeration } from './ReviewModeration';
import { CouponManager } from './CouponManager';
import { ReturnManager } from './ReturnManager';
import { SpecialOfferManager } from './SpecialOfferManager';
import { BestSellingManager } from './BestSellingManager';
import { NewArrivalManager } from './NewArrivalManager';
import { NotificationManager } from './NotificationManager';
import { ProductBuyers } from './ProductBuyers';
import { PopupManager } from './PopupManager';
import { useAuthStore } from '../../store/authStore';
import { BannerModal } from '../../components/admin/BannerModal';
import { ProductModal } from '../../components/admin/ProductModal';
import { CategoryModal } from '../../components/admin/CategoryModal';
import { useUIStore } from '../../store/uiStore';
import { handleApiError } from '../../utils/errorHandler';

export const AdminIndex: React.FC = () => {
  const { setIsAdminModalOpen, adminTheme } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const location = useLocation();
  
  const activeTab = useMemo(() => {
    const parts = location.pathname.split('/');
    const segment = parts[2];
    return !segment || segment === '' ? 'dashboard' : segment;
  }, [location.pathname]);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [data, setData] = useState<{
    banners: Banner[],
    categories: Category[],
    products: Product[]
  }>({
    banners: [],
    categories: [],
    products: []
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Track whether we've already fetched the shared data
  const hasFetchedData = React.useRef(false);

  const fetchData = useCallback(async () => {
    try {
      // Only fetch what the current tab actually needs
      const [banners, categories, productsResponse] = await Promise.all([
        getBanners(),
        getCategories(false, true),
        getProducts({})
      ]);
      setData({
        banners: banners,
        categories: categories,
        products: productsResponse.items
      });
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tabs that need the shared banners/categories/products data
  const DATA_TABS = ['banners', 'categories', 'products', 'inventory', 'dashboard'];

  useEffect(() => {
    if (!isAdmin) return;

    const needsData = DATA_TABS.includes(activeTab);

    // If we've already fetched, never show loading again
    if (hasFetchedData.current) {
      return;
    }

    // If this tab doesn't need shared data, just release loading immediately
    if (!needsData) {
      setLoading(false);
      return;
    }

    // First time we need data — fetch it
    hasFetchedData.current = true;
    setLoading(true);
    const timeout = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, activeTab, fetchData]);

  useEffect(() => {
    setIsAdminModalOpen(isModalOpen);
  }, [isModalOpen, setIsAdminModalOpen]);

  // Apply theme and scrollbar to body and html for "Main Browser Scrollbar" effect
  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add('custom-scrollbar');
      document.documentElement.classList.add('custom-scrollbar');
      document.body.setAttribute('data-theme', adminTheme);
      document.documentElement.setAttribute('data-theme', adminTheme);
    }
    return () => {
      document.body.classList.remove('custom-scrollbar');
      document.documentElement.classList.remove('custom-scrollbar');
      document.body.removeAttribute('data-theme');
      document.documentElement.removeAttribute('data-theme');
    };
  }, [isAdmin, adminTheme]);

  const handleSaveBanner = async (bannerData: Omit<Banner, 'id'>) => {
    if (editingBanner) {
      await updateBanner(editingBanner.id, bannerData);
    } else {
      await createBanner(bannerData);
    }
    await fetchData();
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      await fetchData();
    } catch (error: any) {
      handleApiError(error, 'Failed to save product');
    }
  };

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }
      await fetchData();
    } catch (error: any) {
      handleApiError(error, 'Failed to save category');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      await deleteBanner(id);
      await fetchData();
    } catch (err: any) {
      handleApiError(err, 'Failed to delete banner');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      await fetchData();
    } catch (err: any) {
      handleApiError(err, 'Failed to delete product');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      await fetchData();
    } catch (err: any) {
      handleApiError(err, 'Failed to delete category');
    }
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setEditingProduct(null);
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditBannerModal = (banner: Banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const tier = useMemo(() => {
    switch(activeTab) {
      // Platinum
      case 'banners':
      case 'categories':
      case 'coupons':
        return { name: 'PLATINUM', color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/30' };
        
      // Diamond
      case 'returns':
      case 'notifications':
      case 'reviews':
        return { name: 'DIAMOND', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' };
        
      // Elite
      case 'special-offers':
      case 'best-selling':
      case 'new-arrivals':
      case 'popup':
        return { name: 'ELITE', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' };
        
      // Gold (Default)
      case 'dashboard':
      case 'products':
      case 'inventory':
      case 'orders':
      case 'customers':
      case 'settings':
      default:
        return { name: 'GOLD', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[var(--adm-bg)] font-['Outfit',sans-serif] admin-theme-transition" data-theme={adminTheme}>
      {!isAdmin ? (
        <AdminLogin />
      ) : (
        <div className="flex">
          <Sidebar 
            activeTab={activeTab} 
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />

          <div className="flex-grow flex flex-col min-w-0">
            <AdminNavbar 
              onAdd={['banners', 'categories', 'products', 'inventory'].includes(activeTab) ? openAddModal : undefined}
              addLabel={
                activeTab === 'banners' ? 'Add Banner' :
                activeTab === 'categories' ? 'Add Category' :
                (activeTab === 'products' || activeTab === 'inventory') ? 'Add Product' : undefined
              }
              onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            />

            <main className="flex-grow py-4 px-4 md:py-8 md:px-12 overflow-x-hidden">
              {loading ? (
                <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-32 bg-[var(--adm-card-bg)] rounded-2xl border border-[var(--adm-border)] shadow-sm p-6 space-y-4">
                        <div className="w-10 h-10 rounded-xl skeleton" />
                        <div className="space-y-2">
                          <div className="h-6 w-24 rounded skeleton" />
                          <div className="h-3 w-16 rounded skeleton" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[var(--adm-card-bg)] rounded-[2.5rem] p-8 border border-[var(--adm-border)] shadow-sm space-y-8">
                    <div className="flex justify-between items-center">
                      <div className="h-8 bg-[var(--adm-bg)] w-1/4 rounded-xl skeleton" />
                      <div className="h-10 bg-[var(--adm-bg)] w-32 rounded-xl skeleton" />
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-16 bg-[var(--adm-bg)]/50 rounded-2xl border border-[var(--adm-border)]/50 skeleton" />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in duration-700 max-w-[1600px] mx-auto w-full">
                  <Routes>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={
                      <AdminDashboard 
                        stats={{
                          products: data.products.length,
                          categories: data.categories.length,
                          banners: data.banners.length
                        }} 
                      />
                    } />
                    <Route path="banners" element={
                      <BannerManager 
                        banners={data.banners} 
                        onEdit={openEditBannerModal}
                        onDelete={handleDeleteBanner}
                      />
                    } />
                    <Route path="categories" element={
                      <CategoryManager 
                        categories={data.categories} 
                        products={data.products}
                        onEdit={openEditCategoryModal}
                        onDelete={handleDeleteCategory}
                      />
                    } />
                    <Route path="products" element={
                      <ProductManager 
                        products={data.products} 
                        categories={data.categories}
                        onEdit={openEditProductModal}
                        onDelete={handleDeleteProduct}
                      />
                    } />
                    <Route path="inventory" element={
                      <ProductManager 
                        products={data.products} 
                        categories={data.categories}
                        onEdit={openEditProductModal}
                        onDelete={handleDeleteProduct}
                      />
                    } />
                    <Route path="orders" element={<OrderManager />} />
                    <Route path="customers" element={<CustomerManager />} />
                    <Route path="notifications" element={<NotificationManager />} />
                    <Route path="reviews" element={<ReviewModeration />} />
                    <Route path="coupons" element={<CouponManager />} />
                    <Route path="returns" element={<ReturnManager />} />
                    <Route path="special-offers" element={<SpecialOfferManager />} />
                    <Route path="best-selling" element={<BestSellingManager />} />
                    <Route path="new-arrivals" element={<NewArrivalManager />} />
                    <Route path="products/:id/buyers" element={<ProductBuyers />} />
                    <Route path="popup" element={<PopupManager />} />
                    <Route path="settings" element={<AdminSettings />} />
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                  </Routes>
                </div>
              )}
            </main>

            {/* Tier Indicator Badge */}
            <div className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 px-3 py-1 rounded-lg border backdrop-blur-md font-bold text-sm z-50 ${tier.color} ${tier.bg} ${tier.border} shadow-sm flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              {tier.name}
            </div>
          </div>

          {isModalOpen && activeTab === 'banners' && (
            <BannerModal 
              banner={editingBanner}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveBanner}
            />
          )}

          {isModalOpen && (activeTab === 'products' || activeTab === 'inventory') && (
            <ProductModal 
              product={editingProduct}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveProduct}
            />
          )}

          {isModalOpen && activeTab === 'categories' && (
            <CategoryModal 
              category={editingCategory}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveCategory}
            />
          )}
        </div>
      )}
    </div>
  );
};
