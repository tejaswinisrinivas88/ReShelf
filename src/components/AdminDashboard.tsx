import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Category } from '../types';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Save, 
  RotateCcw, 
  Phone, 
  Instagram, 
  QrCode, 
  Package, 
  FolderTree, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  X,
  Search,
  ArrowLeft,
  KeyRound
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    categories, 
    settings, 
    inquiries,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateStock,
    addCategory, 
    deleteCategory, 
    updateSettings, 
    resetCatalog,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    setActiveView,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'settings' | 'inquiries'>('products');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Product Form State (for adding or editing)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [prodForm, setProdForm] = useState({
    name: '',
    category: 'books',
    price: 199,
    originalPrice: 399,
    stockCopies: 3,
    condition: 'Like New' as Product['condition'],
    description: '',
    imageUrl: '',
    authorOrMaker: '',
    featured: false,
    bestseller: false,
    tagsString: '',
  });

  // Category Form State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catBadge, setCatBadge] = useState('');

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    whatsappNumber: settings.whatsappNumber,
    instagramHandle: settings.instagramHandle,
    instagramUrl: settings.instagramUrl,
    upiId: settings.upiId,
    upiQrImageUrl: settings.upiQrImageUrl,
    announcement: settings.announcement,
    adminPin: settings.adminPin,
    freeShippingThreshold: settings.freeShippingThreshold,
  });

  // Handle Admin PIN login if not authenticated
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pinInput)) {
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Invalid PIN. Default is 1234');
    }
  };

  // Open modal for new product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      category: categories[0]?.slug || 'books',
      price: 199,
      originalPrice: 399,
      stockCopies: 2,
      condition: 'Like New',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
      authorOrMaker: '',
      featured: false,
      bestseller: false,
      tagsString: '',
    });
    setIsProductModalOpen(true);
  };

  // Open modal for editing existing product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice,
      stockCopies: prod.stockCopies,
      condition: prod.condition,
      description: prod.description,
      imageUrl: prod.imageUrl,
      authorOrMaker: prod.authorOrMaker || '',
      featured: !!prod.featured,
      bestseller: !!prod.bestseller,
      tagsString: prod.tags ? prod.tags.join(', ') : '',
    });
    setIsProductModalOpen(true);
  };

  // Handle Product Save (Add or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name.trim()) {
      showToast('Product title is required');
      return;
    }

    const tags = prodForm.tagsString
      ? prodForm.tagsString.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: prodForm.name.trim(),
        category: prodForm.category,
        price: Number(prodForm.price),
        originalPrice: Number(prodForm.originalPrice),
        stockCopies: Number(prodForm.stockCopies),
        condition: prodForm.condition,
        description: prodForm.description.trim(),
        imageUrl: prodForm.imageUrl.trim() || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
        authorOrMaker: prodForm.authorOrMaker.trim(),
        featured: prodForm.featured,
        bestseller: prodForm.bestseller,
        tags,
      });
    } else {
      addProduct({
        name: prodForm.name.trim(),
        category: prodForm.category,
        price: Number(prodForm.price),
        originalPrice: Number(prodForm.originalPrice),
        stockCopies: Number(prodForm.stockCopies),
        condition: prodForm.condition,
        description: prodForm.description.trim(),
        imageUrl: prodForm.imageUrl.trim() || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
        authorOrMaker: prodForm.authorOrMaker.trim(),
        featured: prodForm.featured,
        bestseller: prodForm.bestseller,
        tags,
      });
    }

    setIsProductModalOpen(false);
  };

  // Handle Image File Upload (Base64 conversion)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdForm(prev => ({ ...prev, imageUrl: reader.result as string }));
        showToast('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle UPI QR image upload
  const handleUpiQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsForm(prev => ({ ...prev, upiQrImageUrl: reader.result as string }));
        showToast('UPI QR code uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Category Add
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    const slug = catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addCategory({
      name: catName.trim(),
      slug,
      iconName: 'Sparkles',
      description: catDesc.trim(),
      badge: catBadge.trim() || undefined,
    });
    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setCatBadge('');
    setIsCategoryModalOpen(false);
  };

  // Handle Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      whatsappNumber: settingsForm.whatsappNumber.trim(),
      instagramHandle: settingsForm.instagramHandle.trim(),
      instagramUrl: settingsForm.instagramUrl.trim(),
      upiId: settingsForm.upiId.trim(),
      upiQrImageUrl: settingsForm.upiQrImageUrl,
      announcement: settingsForm.announcement.trim(),
      adminPin: settingsForm.adminPin.trim() || '1234',
      freeShippingThreshold: Number(settingsForm.freeShippingThreshold) || 699,
    });
  };

  // Filter products for admin table
  const adminProducts = products.filter(p => {
    if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.authorOrMaker?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Not authenticated view
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#FAF7F2]">
        <div className="bg-white border border-[#D5C7B3] rounded-2xl max-w-sm w-full p-8 shadow-xl text-center">
          <div className="w-14 h-14 rounded-full bg-[#233D2D] text-white flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-[#E5B582]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#233D2D] mb-1">
            Store Owner Portal
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Enter your owner PIN to manage products, categories, UPI QR codes, and WhatsApp settings.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                placeholder="Enter 4-digit PIN (default: 1234)"
                maxLength={8}
                autoFocus
                className="w-full text-center tracking-widest text-lg font-mono px-4 py-2.5 bg-[#FAF7F2] border border-[#D5C7B3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#233D2D]"
              />
              {pinError && (
                <p className="text-xs text-red-600 mt-1 font-medium">{pinError}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveView('store')}
                className="w-1/2 py-2.5 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Back to Store
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 text-xs font-semibold text-white bg-[#233D2D] hover:bg-[#1A2E22] rounded-lg transition-colors"
              >
                Unlock Dashboard
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E8DFD1] text-[11px] text-stone-400">
            ReShelf Hyderabad Owner Control
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F3EA] min-h-screen pb-20">
      
      {/* Top Admin Header Bar */}
      <div className="bg-[#233E2B] text-white border-b border-[#1A3021] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('store')}
              className="p-1.5 rounded-lg bg-[#2E4F3B] hover:bg-[#3B644B] text-white transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold flex items-center gap-2">
                <span>ReShelf Owner Dashboard</span>
                <span className="bg-[#B8532A] text-white text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin
                </span>
              </h1>
              <p className="text-xs text-[#C2B7A8]">
                Manage Hyderabad inventory, stock, WhatsApp business routing & UPI payments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetCatalog}
              className="px-3 py-1.5 rounded text-xs bg-[#2E4F3B] hover:bg-[#3B644B] text-[#D8CEBE] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset items to default Hyderabad seed catalog"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Catalog</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3 py-1.5 rounded text-xs bg-red-800/60 hover:bg-red-700 text-white transition-colors cursor-pointer"
            >
              Lock & Exit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-[#E8DFD1] shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Total Products
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-serif text-2xl font-bold text-[#233D2D] font-mono">
                {products.length}
              </span>
              <span className="text-xs text-stone-400">across {categories.length} categories</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E8DFD1] shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Stock In Circulation
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-serif text-2xl font-bold text-[#233D2D] font-mono">
                {products.reduce((acc, p) => acc + p.stockCopies, 0)}
              </span>
              <span className="text-xs text-emerald-700 font-medium">available copies</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E8DFD1] shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              WhatsApp Contact
            </span>
            <div className="mt-1 truncate">
              <span className="font-mono text-sm font-bold text-[#233D2D] block truncate">
                {settings.whatsappNumber}
              </span>
              <span className="text-[11px] text-stone-400">Receives chat orders</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E8DFD1] shadow-2xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Active UPI ID
            </span>
            <div className="mt-1 truncate">
              <span className="font-mono text-sm font-bold text-[#233D2D] block truncate">
                {settings.upiId}
              </span>
              <span className="text-[11px] text-stone-400">Zero fees</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8DFD1] gap-2 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'products'
                ? 'border-[#233D2D] text-[#233D2D]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products & Stock ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'categories'
                ? 'border-[#233D2D] text-[#233D2D]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'settings'
                ? 'border-[#233D2D] text-[#233D2D]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Store & UPI Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'inquiries'
                ? 'border-[#233D2D] text-[#233D2D]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>WhatsApp Leads ({inquiries.length})</span>
          </button>
        </div>

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E8DFD1]">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter products..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#D5C7B3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#233D2D]"
                  />
                </div>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-[#FAF7F2] border border-[#D5C7B3] rounded-lg text-stone-700"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="w-full sm:w-auto bg-[#233D2D] hover:bg-[#1A2E22] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-[#E8DFD1] overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5EFE6] border-b border-[#E8DFD1] text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price / MRP</th>
                      <th className="py-3 px-4">Available Copies</th>
                      <th className="py-3 px-4">Condition</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E8DC]">
                    {adminProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-400 text-xs">
                          No matching products found. Click "Add New Product" to create one.
                        </td>
                      </tr>
                    ) : (
                      adminProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.imageUrl}
                                alt={prod.name}
                                className="w-12 h-14 object-cover rounded border border-stone-200 bg-stone-100 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80';
                                }}
                              />
                              <div className="min-w-0 max-w-xs">
                                <h4 className="font-serif font-bold text-[#233D2D] truncate">
                                  {prod.name}
                                </h4>
                                {prod.authorOrMaker && (
                                  <p className="text-[11px] text-stone-500 truncate">
                                    by {prod.authorOrMaker}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="text-stone-700 capitalize font-medium">
                              {prod.category.replace('-', ' ')}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-mono">
                            <span className="font-bold text-[#233D2D]">₹{prod.price}</span>
                            <span className="text-stone-400 line-through ml-1.5 text-[11px]">
                              ₹{prod.originalPrice}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 font-mono">
                              <button
                                onClick={() => updateStock(prod.id, prod.stockCopies - 1)}
                                className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700"
                                title="Decrease stock"
                              >
                                -
                              </button>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold min-w-8 text-center ${
                                prod.stockCopies === 0
                                  ? 'bg-red-100 text-red-700'
                                  : prod.stockCopies <= 2
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-50 text-emerald-800'
                              }`}>
                                {prod.stockCopies}
                              </span>
                              <button
                                onClick={() => updateStock(prod.id, prod.stockCopies + 1)}
                                className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700"
                                title="Increase stock"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="text-stone-600 bg-stone-100 px-2 py-0.5 rounded text-[11px] font-medium">
                              {prod.condition}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="p-1.5 text-stone-600 hover:text-[#233D2D] hover:bg-stone-100 rounded"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete "${prod.name}" from catalog?`)) {
                                    deleteProduct(prod.id);
                                  }
                                }}
                                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#E8DFD1]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#233D2D]">Store Collections</h3>
                <p className="text-xs text-stone-500">Categories displayed in the storefront and filter navigation</p>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="bg-[#233D2D] hover:bg-[#1A2E22] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => {
                const count = products.filter(p => p.category === c.slug).length;
                return (
                  <div key={c.id} className="bg-white p-5 rounded-xl border border-[#E8DFD1] shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif text-base font-bold text-[#233D2D]">{c.name}</h4>
                        {c.badge && (
                          <span className="bg-[#C27852] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {c.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-stone-400 mt-0.5">slug: {c.slug}</p>
                      <p className="text-xs text-stone-600 mt-2">{c.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F0E8DC] flex items-center justify-between text-xs">
                      <span className="font-mono font-medium text-stone-500">{count} products</span>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete category "${c.name}"?`)) {
                            deleteCategory(c.id);
                          }
                        }}
                        className="text-stone-400 hover:text-red-600 p-1"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: STORE & UPI SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8DFD1] shadow-2xs max-w-3xl">
            <h3 className="font-serif text-xl font-bold text-[#233D2D] mb-1">
              Store Contact, WhatsApp & UPI Settings
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Update your direct contact channels, UPI QR code image, and customer delivery rules.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
              
              {/* WhatsApp Number */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  WhatsApp Business Number (with Country Code)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      placeholder="+919876543210"
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#D5C7B3] rounded-lg font-mono text-xs focus:ring-1 focus:ring-[#233D2D]"
                    />
                  </div>
                  <a
                    href={`https://wa.me/${settingsForm.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium shrink-0"
                  >
                    Test WhatsApp
                  </a>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  All "Chat to Buy" and Cart orders will open chats directly to this phone number.
                </p>
              </div>

              {/* Instagram Handle & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Instagram Handle
                  </label>
                  <div className="relative">
                    <Instagram className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={settingsForm.instagramHandle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
                      placeholder="@reshelf.hyderabad"
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#D5C7B3] rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Instagram Profile Link
                  </label>
                  <input
                    type="url"
                    value={settingsForm.instagramUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/reshelf.hyderabad"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C7B3] rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* UPI ID & QR Code Image */}
              <div className="pt-4 border-t border-[#E8DFD1] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Store UPI ID (VPA)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.upiId}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                      placeholder="reshelf@upi"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C7B3] rounded-lg font-mono text-xs"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      Customers will use this ID to make instant UPI payments.
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Free Shipping Threshold (₹)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.freeShippingThreshold}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C7B3] rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>

                {/* UPI QR Code File or URL */}
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    UPI QR Code Image
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-32 h-32 bg-[#FAF7F2] border border-[#D5C7B3] rounded-lg flex items-center justify-center p-2 shrink-0">
                      {settingsForm.upiQrImageUrl ? (
                        <img
                          src={settingsForm.upiQrImageUrl}
                          alt="QR Preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-stone-400">
                          <QrCode className="w-8 h-8 mx-auto mb-1 text-stone-400" />
                          <span className="text-[10px]">Vector QR fallback</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <div>
                        <label className="block text-[11px] text-stone-600 mb-1">
                          Upload Custom QR Code (JPG, PNG):
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUpiQrFileUpload}
                          className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#233D2D] file:text-white hover:file:bg-[#1A2E22]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-600 mb-1">
                          Or paste direct image URL:
                        </label>
                        <input
                          type="url"
                          value={settingsForm.upiQrImageUrl}
                          onChange={(e) => setSettingsForm({ ...settingsForm, upiQrImageUrl: e.target.value })}
                          placeholder="https://example.com/my-upi-qr.png"
                          className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#D5C7B3] rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Announcement Banner */}
              <div className="pt-4 border-t border-[#E8DFD1]">
                <label className="block font-semibold text-stone-800 mb-1">
                  Top Announcement Banner Text
                </label>
                <input
                  type="text"
                  value={settingsForm.announcement}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C7B3] rounded-lg text-xs"
                />
              </div>

              {/* Owner Passcode (PIN) */}
              <div className="pt-4 border-t border-[#E8DFD1]">
                <label className="block font-semibold text-stone-800 mb-1">
                  Owner Passcode PIN (Used to log into this panel)
                </label>
                <input
                  type="text"
                  value={settingsForm.adminPin}
                  onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                  maxLength={10}
                  className="w-48 px-3 py-2 bg-[#FAF7F2] border border-[#D5C7B3] rounded-lg font-mono text-xs tracking-wider"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#233D2D] hover:bg-[#1A2E22] text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Store Settings</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 4: WHATSAPP LEADS & INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-[#E8DFD1] flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#233D2D]">Customer Inquiries & WhatsApp Orders</h3>
                <p className="text-xs text-stone-500">Recorded when shoppers click "Chat to Buy" or "Checkout via WhatsApp"</p>
              </div>
              <span className="font-mono text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                {inquiries.length} Inquiries Logged
              </span>
            </div>

            <div className="bg-white rounded-xl border border-[#E8DFD1] overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5EFE6] border-b border-[#E8DFD1] text-stone-600 font-semibold uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Date / Time</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Items Inquired</th>
                      <th className="py-3 px-4">Estimated Value</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E8DC]">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-stone-400">
                          No inquiries logged yet. When customers click "Chat to Buy" on the storefront, orders appear here!
                        </td>
                      </tr>
                    ) : (
                      inquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-[#FAF7F2]/60">
                          <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                            {inq.timestamp}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              inq.type === 'single_chat_to_buy'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {inq.type === 'single_chat_to_buy' ? 'Single Product' : 'Cart Order'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-[#233D2D] max-w-sm truncate">
                            {inq.productNames}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-[#233D2D]">
                            ₹{inq.totalAmount}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{inq.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#D5C7B3] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD1]">
              <h3 className="font-serif text-2xl font-bold text-[#233D2D]">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    placeholder="e.g. The Midnight Library"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B3] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B3] rounded-lg"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    ReShelf Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B3] rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Original MRP (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={prodForm.originalPrice}
                    onChange={(e) => setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B3] rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Available Copies / Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={prodForm.stockCopies}
                    onChange={(e) => setProdForm({ ...prodForm, stockCopies: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B3] rounded-lg font-mono font-bold text-[#233D2D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Condition *
                  </label>
                  <select
                    value={prodForm.condition}
                    onChange={(e) => setProdForm({ ...prodForm, condition: e.target.value as Product['condition'] })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B3] rounded-lg"
                  >
                    <option value="Like New">Like New (Mint)</option>
                    <option value="Gently Read">Gently Read (Clean)</option>
                    <option value="Good Condition">Good Condition</option>
                    <option value="Handmade">Handmade (Craft)</option>
                    <option value="Custom Made">Custom Made (B2B Bags)</option>
                    <option value="Pristine">Pristine / Unused</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Author / Artisan / Maker
                  </label>
                  <input
                    type="text"
                    value={prodForm.authorOrMaker}
                    onChange={(e) => setProdForm({ ...prodForm, authorOrMaker: e.target.value })}
                    placeholder="e.g. Matt Haig, or Local Hyderabad Artist"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B3] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  placeholder="Detail the story, condition of pages/spine, materials used, etc."
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B3] rounded-lg leading-relaxed"
                />
              </div>

              {/* Product Image */}
              <div className="space-y-2">
                <label className="block font-semibold text-stone-700">
                  Product Image
                </label>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-20 bg-stone-100 rounded border border-stone-300 overflow-hidden shrink-0">
                    {prodForm.imageUrl ? (
                      <img src={prodForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:bg-stone-200 file:text-stone-700"
                    />
                    <input
                      type="url"
                      value={prodForm.imageUrl}
                      onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                      placeholder="Or enter direct image URL..."
                      className="w-full px-3 py-1.5 bg-white border border-[#D5C7B3] rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={prodForm.tagsString}
                  onChange={(e) => setProdForm({ ...prodForm, tagsString: e.target.value })}
                  placeholder="e.g. Bestseller, Fiction, Hardcover"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B3] rounded-lg"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.featured}
                    onChange={(e) => setProdForm({ ...prodForm, featured: e.target.checked })}
                    className="rounded text-[#233D2D]"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.bestseller}
                    onChange={(e) => setProdForm({ ...prodForm, bestseller: e.target.checked })}
                    className="rounded text-[#233D2D]"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8DFD1] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#233D2D] hover:bg-[#1A2E22] text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'Save Changes' : 'Publish Product'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CATEGORY ADD MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#FAF7F2] border border-[#D5C7B3] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD1]">
              <h3 className="font-serif text-lg font-bold text-[#233D2D]">Add New Collection</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Handmade Bookmarks"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B3] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Slug (URL identifier)</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="e.g. bookmarks (auto-generated if empty)"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B3] rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="e.g. Hand-painted floral bookmarks on cotton paper"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B3] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Promotional Badge (optional)</label>
                <input
                  type="text"
                  value={catBadge}
                  onChange={(e) => setCatBadge(e.target.value)}
                  placeholder="e.g. New, 50% Off"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B3] rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-[#E8DFD1] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#233D2D] text-white font-semibold rounded-lg"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
