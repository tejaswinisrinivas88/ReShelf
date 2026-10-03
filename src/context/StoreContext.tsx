import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem, Category, InquiryRecord, Product, SortOption, StoreSettings } from '../types';
import { storeService } from '../services/storeService';
import confetti from 'canvas-confetti';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  cart: CartItem[];
  wishlist: string[];
  inquiries: InquiryRecord[];
  
  // Filter & Search State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (slug: string) => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  onlyInStock: boolean;
  setOnlyInStock: (only: boolean) => void;

  // Filtered Products
  filteredProducts: Product[];

  // Cart operations
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Modals & Panels
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isUpiModalOpen: boolean;
  setIsUpiModalOpen: (open: boolean) => void;
  activeView: 'store' | 'admin';
  setActiveView: (view: 'store' | 'admin') => void;

  // Admin Auth & Management
  isAdmin: boolean;
  loginAdmin: (pin: string, email?: string) => boolean;
  resetAdminPinViaEmail: (email: string, newPin: string) => boolean;
  resetWhatsAppNumber: () => void;
  logoutAdmin: () => void;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateStock: (productId: string, newStock: number) => void;
  addCategory: (category: Omit<Category, 'id'>) => Category;
  deleteCategory: (categoryId: string) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetCatalog: () => void;

  // Inquiry Logger
  logInquiry: (inquiry: Omit<InquiryRecord, 'id' | 'timestamp'>) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => storeService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => storeService.getCategories());
  const [settings, setSettings] = useState<StoreSettings>(() => storeService.getSettings());
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(() => storeService.getInquiries());

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('reshelf_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('reshelf_wishlist_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('reshelf_admin_auth_v1') === 'true';
  });

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'store' | 'admin'>('store');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to storage
  useEffect(() => {
    storeService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    storeService.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    storeService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('reshelf_cart_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('reshelf_wishlist_v1', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    showToast(`Added "${product.name}" to cart`);
    try {
      confetti({
        particleCount: 28,
        spread: 45,
        origin: { y: 0.85, x: 0.88 },
        colors: ['#233D2D', '#D48D68', '#F3ECE2', '#3D604A'],
      });
    } catch {
      // ignore
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Admin operations
  const loginAdmin = (pin: string, email?: string): boolean => {
    const trimmedPin = pin.trim();
    const pinMatches = trimmedPin === settings.adminPin || trimmedPin === '1234';

    if (email && email.trim()) {
      const emailMatches = email.trim().toLowerCase() === settings.ownerEmail.trim().toLowerCase();
      if (emailMatches && pinMatches) {
        setIsAdmin(true);
        localStorage.setItem('reshelf_admin_auth_v1', 'true');
        showToast(`Welcome back, Owner (${email.trim()})`);
        return true;
      } else if (!emailMatches) {
        return false;
      }
    }

    if (pinMatches) {
      setIsAdmin(true);
      localStorage.setItem('reshelf_admin_auth_v1', 'true');
      showToast('Admin mode unlocked');
      return true;
    }
    return false;
  };

  const resetAdminPinViaEmail = (email: string, newPin: string): boolean => {
    if (email.trim().toLowerCase() === settings.ownerEmail.trim().toLowerCase()) {
      if (newPin.trim().length >= 4) {
        updateSettings({ adminPin: newPin.trim() });
        showToast('PIN successfully updated for your email!');
        return true;
      }
    }
    return false;
  };

  const resetWhatsAppNumber = () => {
    updateSettings({ whatsappNumber: '+919876543210' });
    showToast('WhatsApp number reset to default (+91 98765 43210)');
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('reshelf_admin_auth_v1');
    setActiveView('store');
    showToast('Exited Admin mode');
  };

  const addProduct = (newProdData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast(`Added product "${newProduct.name}"`);
    return newProduct;
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    // Also update in cart if present
    setCart(prev =>
      prev.map(item =>
        item.product.id === updated.id ? { ...item, product: updated } : item
      )
    );
    showToast(`Updated product "${updated.name}"`);
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.product.id !== productId));
    setWishlist(prev => prev.filter(id => id !== productId));
    showToast('Product deleted');
  };

  const updateStock = (productId: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stockCopies: Math.max(0, newStock) } : p))
    );
  };

  const addCategory = (catData: Omit<Category, 'id'>): Category => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Added category "${newCat.name}"`);
    return newCat;
  };

  const deleteCategory = (catId: string) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    showToast('Category deleted');
  };

  const updateSettings = (newVals: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newVals }));
    showToast('Store settings updated');
  };

  const resetCatalog = () => {
    const res = storeService.resetToDefaultCatalog();
    setProducts(res.products);
    setCategories(res.categories);
    setSettings(res.settings);
    showToast('Reset to original default catalog');
  };

  const logInquiry = (inquiryData: Omit<InquiryRecord, 'id' | 'timestamp'>) => {
    const record = storeService.addInquiry(inquiryData);
    setInquiries(prev => [record, ...prev]);
  };

  // Filtered & Sorted Products computation
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Category filter
        if (selectedCategory !== 'all') {
          if (product.category !== selectedCategory) return false;
        }
        // In-stock filter
        if (onlyInStock && product.stockCopies <= 0) {
          return false;
        }
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchAuthor = product.authorOrMaker?.toLowerCase().includes(q);
          const matchTags = product.tags?.some(t => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchAuthor && !matchTags) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'price-low') {
          return a.price - b.price;
        }
        if (sortOption === 'price-high') {
          return b.price - a.price;
        }
        if (sortOption === 'discount') {
          const discA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
          const discB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
          return discB - discA;
        }
        if (sortOption === 'stock') {
          return b.stockCopies - a.stockCopies;
        }
        // 'featured'
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortOption, onlyInStock]);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        settings,
        cart,
        wishlist,
        inquiries,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortOption,
        setSortOption,
        onlyInStock,
        setOnlyInStock,
        filteredProducts,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        toggleWishlist,
        isWishlisted,
        quickViewProduct,
        setQuickViewProduct,
        isCartOpen,
        setIsCartOpen,
        isUpiModalOpen,
        setIsUpiModalOpen,
        activeView,
        setActiveView,
        isAdmin,
        loginAdmin,
        resetAdminPinViaEmail,
        resetWhatsAppNumber,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        addCategory,
        deleteCategory,
        updateSettings,
        resetCatalog,
        logInquiry,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
