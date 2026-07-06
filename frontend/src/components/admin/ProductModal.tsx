import React, { useState, useEffect } from 'react';
import { X, Loader2, Trash2, Package, Tag, DollarSign, Box, Image as ImageIcon, Star, Users, Video, ShieldCheck, Truck, Clock } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { getCategories } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import type { Product, Category } from '../../types';
import { handleApiError } from '../../utils/errorHandler';

interface ProductModalProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Partial<Product>) => Promise<void>;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSave }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    brand: '',
    price: 0,
    salePrice: null,
    stock: 0,
    categoryId: '',
    images: '[]',
    tags: '[]',
    overview: '',
    specification: '',
    highlights: '[]',
    howItWorks: '[]',
    benefits: '[]',
    videoUrl: '',
    faqs: '[]',
    specSheetUrl: '',
    comparisonData: '{"headers":[], "rows":[]}',
    bundleProducts: '[]',
    qna: '[]',
    deliveryInfo: '',
    warrantyInfo: '',
    offerDeadline: '',
    trustBadges: '[]',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch {
        console.error('Failed to fetch categories');
      }
    };
    fetchCats();
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        brand: product.brand || '',
        price: product.price || 0,
        salePrice: product.salePrice || null,
        stock: product.stock || 0,
        categoryId: product.categoryId || '',
        images: product.images || '[]',
        tags: product.tags || '[]',
        overview: product.overview || '',
        specification: product.specification || '',
        highlights: product.highlights || '[]',
        howItWorks: product.howItWorks || '[]',
        benefits: product.benefits || '[]',
        videoUrl: product.videoUrl || '',
        faqs: product.faqs || '[]',
        specSheetUrl: product.specSheetUrl || '',
        comparisonData: product.comparisonData || '{"headers":[], "rows":[]}',
        bundleProducts: product.bundleProducts || '[]',
        qna: product.qna || '[]',
        deliveryInfo: product.deliveryInfo || '',
        warrantyInfo: product.warrantyInfo || '',
        offerDeadline: product.offerDeadline ? new Date(product.offerDeadline).toISOString().slice(0, 16) : '',
        trustBadges: product.trustBadges || '[]',
      });
      try {
        setImages(JSON.parse(product.images || '[]'));
        setTags(JSON.parse(product.tags || '[]'));
      } catch {
        setImages([]);
        setTags([]);
      }
    } else {
      setFormData({
        title: '',
        brand: '',
        price: 0,
        salePrice: null,
        stock: 0,
        categoryId: '',
        images: '[]',
        tags: '[]',
        overview: '',
        specification: '',
      });
      setImages([]);
      setTags([]);
      setFormData({
        title: '',
        brand: '',
        price: 0,
        salePrice: null,
        stock: 0,
        categoryId: '',
        images: '[]',
        tags: '[]',
        overview: '',
        specification: '',
        highlights: '[]',
        howItWorks: '[]',
        benefits: '[]',
        videoUrl: '',
        faqs: '[]',
        specSheetUrl: '',
        comparisonData: '{"headers":[], "rows":[]}',
        bundleProducts: '[]',
        qna: '[]',
        deliveryInfo: '',
        warrantyInfo: '',
        offerDeadline: '',
        trustBadges: '[]',
      });
    }
  }, [product]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      handleApiError(null, 'Title and Price are required');
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        images: JSON.stringify(images),
        tags: JSON.stringify(tags),
      });
      onClose();
    } catch (err: any) {
      handleApiError(err, 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const setAsCover = (index: number) => {
    const newImages = [...images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    setImages(newImages);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 bg-primary/20 backdrop-blur-xl flex items-center justify-center z-[100] p-3 md:p-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl md:rounded-[2.5rem] w-full max-w-4xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-700 max-h-[95vh] md:max-h-[90vh] flex flex-col border border-white/40">
        
        {/* Header */}
        <div className="p-5 md:p-8 border-b border-gray-100/50 flex justify-between items-center bg-gradient-to-br from-gray-50 via-white to-white flex-shrink-0 relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          
          <div className="flex items-center gap-3 md:gap-5 relative">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-accent/10 rounded-xl md:rounded-2xl flex items-center justify-center text-accent shadow-inner flex-shrink-0">
              <Package size={24} className="md:w-7 md:h-7" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-black text-primary tracking-tight leading-none mb-1 md:mb-2">{product ? 'Refine Masterpiece' : 'Create New Product'}</h2>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-6 bg-accent rounded-full" />
                <p className="text-[10px] font-black text-muted/50 uppercase tracking-[0.2em]">Inventory Management Portal</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {product && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/admin/products/${product.id}/buyers`);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100 shadow-sm"
              >
                <Users size={16} />
                View Buyers
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-3.5 hover:bg-gray-100 rounded-2xl text-muted hover:text-accent transition-all shadow-sm hover:rotate-90 duration-500 bg-white border border-gray-50"
            >
              <X size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-hidden flex flex-col">
          <div className="flex-grow overflow-y-auto p-5 md:p-8 custom-scrollbar space-y-6 md:space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10">
              
              {/* Left Column: Basic Info */}
              <div className="lg:col-span-3 space-y-8 md:space-y-10">
                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-base md:text-lg font-black text-primary flex items-center gap-3">
                    <div className="w-7 h-7 md:w-9 md:h-9 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Box size={16} className="md:w-5 md:h-5 text-primary" />
                    </div>
                    Basic Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-1">Product Title</label>
                      <input 
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-bold text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none placeholder:text-gray-300 shadow-sm border-b-accent/10"
                        placeholder="e.g. Premium Foldable Baby Playpen"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-[10px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-1">Brand Name</label>
                        <input 
                          type="text"
                          value={formData.brand || ''}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-bold text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none placeholder:text-gray-300 shadow-sm border-b-accent/10"
                          placeholder="Aurelia"
                        />
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-[10px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-1">Category</label>
                        <div className="relative">
                          <select 
                            value={formData.categoryId || ''}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-bold text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none appearance-none shadow-sm cursor-pointer border-b-accent/10"
                          >
                            <option value="">Choose a category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted/40">
                            <Tag size={18} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-base md:text-lg font-black text-primary flex items-center gap-3">
                    <div className="w-7 h-7 md:w-9 md:h-9 bg-accent/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign size={16} className="md:w-5 md:h-5 text-accent" />
                    </div>
                    Pricing & Inventory
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-2 md:gap-6">
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[9px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-0.5 md:ml-1">Base Price</label>
                      <input 
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-xl md:rounded-2xl px-3 py-3 md:px-6 md:py-4 text-sm md:text-base font-black text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none shadow-sm border-b-accent/10"
                      />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[9px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-0.5 md:ml-1">Sale Price</label>
                      <input 
                        type="number"
                        value={formData.salePrice || ''}
                        onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || null })}
                        className="w-full bg-accent/[0.03] border-2 border-accent/20 rounded-xl md:rounded-2xl px-3 py-3 md:px-6 md:py-4 text-sm md:text-base font-black text-accent focus:border-accent/40 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none shadow-sm border-b-accent/30"
                        placeholder="Opt."
                      />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[9px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-0.5 md:ml-1">Stock Level</label>
                      <input 
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                        className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-xl md:rounded-2xl px-3 py-3 md:px-6 md:py-4 text-sm md:text-base font-black text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none shadow-sm border-b-accent/10"
                      />
                    </div>
                  </div>

                  {/* Special Offer Toggle */}
                  <div className="bg-orange-50/50 border-2 border-orange-100/50 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-lg md:rounded-xl flex items-center justify-center text-orange-600 flex-shrink-0">
                        <Tag size={16} className="md:w-5 md:h-5" />
                      </div>
                      <div>
                        <div className="text-xs md:text-sm font-black text-primary uppercase tracking-wider">Special Offer</div>
                        <div className="text-[9px] md:text-[10px] font-bold text-orange-600/70 uppercase leading-tight">Featured in countdown section</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (tags.includes('special-offer')) {
                          setTags(tags.filter(t => t !== 'special-offer'));
                        } else {
                          setTags([...tags, 'special-offer']);
                        }
                      }}
                      className={`w-12 h-7 md:w-14 md:h-8 rounded-full transition-all relative flex-shrink-0 ${tags.includes('special-offer') ? 'bg-orange-500' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full transition-all ${tags.includes('special-offer') ? 'right-1' : 'left-1 shadow-sm'}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-base md:text-lg font-black text-primary flex items-center gap-3">
                    <div className="w-7 h-7 md:w-9 h-9 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Box size={16} className="md:w-5 md:h-5 text-primary" />
                    </div>
                    Product Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-1">Overview</label>
                      <textarea 
                        value={formData.overview || ''}
                        onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                        className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-bold text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none placeholder:text-gray-300 shadow-sm border-b-accent/10 min-h-[100px] md:min-h-[120px] resize-none"
                        placeholder="Detailed product overview..."
                      />
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-1">Specification</label>
                      <textarea 
                        value={formData.specification || ''}
                        onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                        className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-bold text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none placeholder:text-gray-300 shadow-sm border-b-accent/10 min-h-[100px] md:min-h-[120px] resize-none"
                        placeholder="Technical specifications..."
                      />
                    </div>
                  </div>
                </div>

                {/* Advanced Marketing Section */}
                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-base md:text-lg font-black text-primary flex items-center gap-3">
                    <div className="w-7 h-7 md:w-9 h-9 bg-accent/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={16} className="md:w-5 md:h-5 text-accent" />
                    </div>
                    Advanced Marketing & Content
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-1">Delivery Info</label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={formData.deliveryInfo || ''}
                          onChange={(e) => setFormData({ ...formData, deliveryInfo: e.target.value })}
                          className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 pl-10 md:pl-12 text-xs md:text-sm font-bold text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none shadow-sm"
                          placeholder="e.g. ৩-৫ দিনে ডেলিভারি"
                        />
                        <Truck size={16} className="md:w-4.5 md:h-4.5 absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-muted/40" />
                      </div>
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-1">Warranty Info</label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={formData.warrantyInfo || ''}
                          onChange={(e) => setFormData({ ...formData, warrantyInfo: e.target.value })}
                          className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 pl-10 md:pl-12 text-xs md:text-sm font-bold text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none shadow-sm"
                          placeholder="e.g. 1 Year Warranty"
                        />
                        <ShieldCheck size={16} className="md:w-4.5 md:h-4.5 absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-muted/40" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-1">Offer Deadline (Timer)</label>
                      <div className="relative">
                        <input 
                          type="datetime-local"
                          value={formData.offerDeadline as string || ''}
                          onChange={(e) => setFormData({ ...formData, offerDeadline: e.target.value })}
                          className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 pl-10 md:pl-12 text-xs md:text-sm font-bold text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none shadow-sm"
                        />
                        <Clock size={16} className="md:w-4.5 md:h-4.5 absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-muted/40" />
                      </div>
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-1">Video URL (Demo/Unboxing)</label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={formData.videoUrl || ''}
                          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                          className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 pl-10 md:pl-12 text-xs md:text-sm font-bold text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none shadow-sm"
                          placeholder="YouTube or Video Link"
                        />
                        <Video size={16} className="md:w-4.5 md:h-4.5 absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-muted/40" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-1">Feature Highlights (JSON)</label>
                      <textarea 
                        value={formData.highlights || '[]'}
                        onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                        className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-xs font-mono font-bold text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none min-h-[80px] md:min-h-[100px] resize-none"
                        placeholder='[{"icon": "Music", "title": "Melodies", "description": "12 soothing songs"}]'
                      />
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-1">FAQs (JSON)</label>
                      <textarea 
                        value={formData.faqs || '[]'}
                        onChange={(e) => setFormData({ ...formData, faqs: e.target.value })}
                        className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-xs font-mono font-bold text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none min-h-[80px] md:min-h-[100px] resize-none"
                        placeholder='[{"question": "Safe for 6m?", "answer": "Yes, totally safe."}]'
                      />
                    </div>
                    
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-[11px] font-black text-muted/60 uppercase tracking-widest ml-1">Trust Badges (JSON)</label>
                      <textarea 
                        value={formData.trustBadges || '[]'}
                        onChange={(e) => setFormData({ ...formData, trustBadges: e.target.value })}
                        className="w-full bg-gray-50/80 border-2 border-gray-100 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-xs font-mono font-bold text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none min-h-[60px] md:min-h-[80px] resize-none"
                        placeholder='[{"icon": "Shield", "label": "EN71 Certified"}]'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Media & Tags */}
              <div className="lg:col-span-2 space-y-8 md:space-y-10">
                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-base md:text-lg font-black text-primary flex items-center gap-3">
                    <div className="w-7 h-7 md:w-9 h-9 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={16} className="md:w-5 md:h-5 text-primary" />
                    </div>
                    Product Media
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((url, i) => (
                      <div key={i} className={`relative group aspect-square rounded-2xl overflow-hidden border-2 shadow-sm transition-all hover:shadow-lg hover:scale-[1.05] ${i === 0 ? 'border-accent ring-4 ring-accent/10' : 'border-gray-100'}`}>
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        
                        {i === 0 && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-accent text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg flex items-center gap-1 z-10 animate-in fade-in zoom-in duration-300">
                            <Star size={10} fill="currentColor" /> Cover
                          </div>
                        )}

                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                          {i !== 0 && (
                            <button 
                              type="button"
                              onClick={() => setAsCover(i)}
                              className="w-10 h-10 bg-white text-accent rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl"
                              title="Set as Cover"
                            >
                              <Star size={20} />
                            </button>
                          )}
                          <button 
                            type="button"
                            onClick={() => removeImage(i)}
                            className="w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl"
                            title="Delete Image"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {images.length < 6 && (
                      <div className="aspect-square">
                        <ImageUpload 
                          onUploadSuccess={(url) => setImages([...images, url])}
                          compact
                          multiple={true}
                        />
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-1.5 bg-gray-50 rounded-full inline-block mx-auto">
                    <p className="text-[9px] font-black text-muted/40 uppercase tracking-[0.2em] text-center">Max 6 High-Fidelity Assets • PNG/JPG</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-base md:text-lg font-black text-primary flex items-center gap-3">
                    <div className="w-7 h-7 md:w-9 h-9 bg-accent/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Tag size={16} className="md:w-5 md:h-5 text-accent" />
                    </div>
                    Product Tags
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-grow bg-gray-50/80 border-2 border-gray-100 rounded-xl px-4 py-3 md:px-5 md:py-3.5 text-sm font-bold text-primary focus:border-accent/30 focus:bg-white focus:ring-[10px] focus:ring-accent/5 transition-all outline-none shadow-sm border-b-accent/10"
                        placeholder="Add tag (e.g. Bestseller)"
                      />
                      <button 
                        type="button"
                        onClick={addTag}
                        className="px-4 md:px-5 bg-accent/10 text-accent rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-white transition-all shadow-sm"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 md:px-4 md:py-2 bg-white border-2 border-gray-100 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 md:gap-2 group shadow-sm hover:border-accent/20 transition-colors">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="text-muted hover:text-accent transition-colors">
                            <X size={12} strokeWidth={3} />
                          </button>
                        </span>
                      ))}
                      {tags.length === 0 && (
                        <div className="w-full p-4 md:p-6 border-2 border-dashed border-gray-100 rounded-xl md:rounded-2xl flex items-center justify-center">
                          <p className="text-[9px] md:text-[10px] text-muted/30 italic font-bold uppercase tracking-widest">No tags established yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 md:p-6 border-t border-gray-100 bg-white/50 backdrop-blur-md flex gap-3 md:gap-4 flex-shrink-0">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 md:px-8 md:py-4 bg-white border-2 border-gray-200 text-muted rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 hover:text-primary hover:border-accent/30 transition-all shadow-sm active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="flex-[2] px-4 py-3 md:px-8 md:py-4 bg-primary text-white rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary/90 hover:-translate-y-1 hover:shadow-[0_15px_30px_-8px_rgba(15,23,42,0.3)] active:translate-y-0 transition-all flex items-center justify-center gap-2 md:gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isSaving ? (
                <>
                  <Loader2 size={16} className="md:w-5 md:h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Package size={16} className="md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                  {product ? 'Sync Updates' : 'Commit Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
