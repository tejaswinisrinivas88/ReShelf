import { Category, InquiryRecord, Product, StoreSettings } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/seedData';

const STORAGE_KEYS = {
  PRODUCTS: 'reshelf_products_v1',
  CATEGORIES: 'reshelf_categories_v1',
  SETTINGS: 'reshelf_settings_v1',
  CART: 'reshelf_cart_v1',
  WISHLIST: 'reshelf_wishlist_v1',
  INQUIRIES: 'reshelf_inquiries_v1',
  ADMIN_AUTH: 'reshelf_admin_auth_v1',
};

export const storeService = {
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to read products from localStorage', e);
    }
    // Seed with initial products
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  },

  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to read categories from localStorage', e);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  },

  saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  },

  getSettings(): StoreSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...INITIAL_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Failed to read settings from localStorage', e);
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  },

  saveSettings(settings: StoreSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  },

  getInquiries(): InquiryRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to read inquiries from localStorage', e);
    }
    return [];
  },

  addInquiry(inquiry: Omit<InquiryRecord, 'id' | 'timestamp'>): InquiryRecord {
    const records = this.getInquiries();
    const newRecord: InquiryRecord = {
      ...inquiry,
      id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };
    records.unshift(newRecord);
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(records.slice(0, 50)));
    } catch (e) {
      console.error('Failed to save inquiry', e);
    }
    return newRecord;
  },

  resetToDefaultCatalog(): { products: Product[]; categories: Category[]; settings: StoreSettings } {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    return {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      settings: INITIAL_SETTINGS,
    };
  },
};
