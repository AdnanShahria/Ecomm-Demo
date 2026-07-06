import { useState, useEffect } from 'react';
import { getProducts, updateProduct, getBanners, updateBanner, getCategories, updateCategory, refreshCache } from '../services/api';
import { uploadImage } from '../services/imgbb';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';
import type { Product, Banner, Category } from '../types';
import { RefreshCw, CheckCircle, Image as ImageIcon, AlertTriangle, ArrowRight } from 'lucide-react';

interface CompressItem {
  id: string;
  title: string;
  type: 'product' | 'banner' | 'category';
  images: string[];
  original: any;
}

export const ImageCompress = () => {
  const [items, setItems] = useState<CompressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [compressing, setCompressing] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [filter, setFilter] = useState<'all' | 'product' | 'banner' | 'category'>('all');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [productsRes, banners, categories] = await Promise.all([
        getProducts({ limit: 500 }),
        getBanners(),
        getCategories(false, true)
      ]);

      const allItems: CompressItem[] = [];

      // Process Products
      if (productsRes.items) {
        productsRes.items.forEach((p: Product) => {
          let imgs: string[] = [];
          try {
            if (typeof p.images === 'string') {
              imgs = JSON.parse(p.images);
            } else if (Array.isArray(p.images)) {
              imgs = p.images;
            }
          } catch (e) {}
          
          if (imgs.length > 0) {
            allItems.push({
              id: `product_${p.id}`,
              title: `[Product] ${p.title}`,
              type: 'product',
              images: imgs,
              original: p
            });
          }
        });
      }

      // Process Banners
      banners.forEach((b: Banner) => {
        if (b.image) {
          allItems.push({
            id: `banner_${b.id}`,
            title: `[Banner] ${b.position} - Order ${b.order}`,
            type: 'banner',
            images: [b.image],
            original: b
          });
        }
      });

      // Process Categories
      categories.forEach((c: Category) => {
        if (c.image) {
          allItems.push({
            id: `category_${c.id}`,
            title: `[Category] ${c.name}`,
            type: 'category',
            images: [c.image],
            original: c
          });
        }
      });

      setItems(allItems);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const compressAndReplaceImage = async (url: string): Promise<string> => {
    // 1. Fetch image as blob
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], "image.jpg", { type: blob.type });

    // 2. Compress image to WebP
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: 0.8
    };
    
    const compressedFile = await imageCompression(file, options);
    
    // 3. Upload to ImgBB
    const newUrl = await uploadImage(compressedFile);
    return newUrl;
  };

  const handleCompressItem = async (item: CompressItem) => {
    if (compressing[item.id]) return;

    try {
      setCompressing(prev => ({ ...prev, [item.id]: true }));
      
      const newImages: string[] = [];
      let compressedCount = 0;

      for (const url of item.images) {
        if (url.includes('.webp') && !url.includes('original')) {
          newImages.push(url);
          continue;
        }

        try {
          const newUrl = await compressAndReplaceImage(url);
          newImages.push(newUrl);
          compressedCount++;
        } catch (err) {
          console.error(`Failed to compress ${url}:`, err);
          newImages.push(url); // keep original if failed
        }
      }

      if (compressedCount > 0) {
        // Update database based on type
        if (item.type === 'product') {
          await updateProduct(item.original.id, { images: JSON.stringify(newImages) });
        } else if (item.type === 'banner') {
          await updateBanner(item.original.id, { image: newImages[0] });
        } else if (item.type === 'category') {
          await updateCategory(item.original.id, { image: newImages[0] });
        }

        toast.success(`Compressed ${compressedCount} image(s) for ${item.title}`);
        
        // Update local state
        setItems(prev => prev.map(p => p.id === item.id ? { ...p, images: newImages } : p));
      } else {
        toast('Images already optimized or failed to compress');
      }

    } catch (error) {
      console.error('Failed to compress images:', error);
      toast.error('Failed to compress images');
    } finally {
      setCompressing(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const handleCompressAll = async () => {
    const confirm = window.confirm("Are you sure you want to compress ALL images (Products, Banners, Categories)? This might take a while.");
    if (!confirm) return;

    const itemsToCompress = filteredItems.filter(p => p.images.some(url => !url.includes('.webp')));

    setProgress({ current: 0, total: itemsToCompress.length });

    for (let i = 0; i < itemsToCompress.length; i++) {
      await handleCompressItem(itemsToCompress[i]);
      setProgress({ current: i + 1, total: itemsToCompress.length });
    }

    toast.success("Finished bulk compression!");
    setProgress(null);
  };

  const handlePublishCache = async () => {
    try {
      await refreshCache();
      toast.success("Cache published successfully!");
    } catch (error) {
      console.error("Failed to publish cache:", error);
      toast.error("Failed to publish cache");
    }
  };

  const filteredItems = items.filter(item => filter === 'all' || item.type === filter);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><RefreshCw className="animate-spin w-8 h-8 text-blue-600" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-blue-600" />
            Universal Image Compression Tool
          </h1>
          <p className="text-gray-500 mt-1">Compress existing products, banners, and categories to WebP</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-700"
          >
            <option value="all">All Types</option>
            <option value="product">Products</option>
            <option value="banner">Banners</option>
            <option value="category">Categories</option>
          </select>
          <button
            onClick={handlePublishCache}
            className="px-6 py-3 bg-white text-blue-600 border border-blue-200 font-medium rounded-xl hover:bg-blue-50 transition-all shadow-sm flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Publish Cache
          </button>
          <button
            onClick={handleCompressAll}
            disabled={!!progress}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {progress ? <RefreshCw className="animate-spin w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
            {progress ? `Compressing (${progress.current}/${progress.total})` : 'Compress All'}
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r-xl">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <strong>Warning:</strong> This will download images, compress them to WebP, upload them back to ImgBB, and update the database. 
              Existing non-WebP images will be replaced.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => {
          const needsCompression = item.images.some(url => !url.includes('.webp'));
          
          return (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-100 relative group">
                {item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                {needsCompression && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                    Needs Compression
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-full font-medium shadow-sm uppercase tracking-wider">
                  {item.type}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 truncate mb-1" title={item.title}>{item.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{item.images.length} image(s)</p>
                
                <button
                  onClick={() => handleCompressItem(item)}
                  disabled={compressing[item.id] || !needsCompression || item.images.length === 0}
                  className={`w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                    compressing[item.id] 
                      ? 'bg-blue-50 text-blue-600' 
                      : !needsCompression 
                        ? 'bg-green-50 text-green-600 cursor-not-allowed'
                        : item.images.length === 0
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {compressing[item.id] ? (
                    <><RefreshCw className="animate-spin w-4 h-4" /> Compressing...</>
                  ) : !needsCompression ? (
                    <><CheckCircle className="w-4 h-4" /> Optimized</>
                  ) : item.images.length === 0 ? (
                    'No Images'
                  ) : (
                    <>Compress to WebP <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageCompress;
