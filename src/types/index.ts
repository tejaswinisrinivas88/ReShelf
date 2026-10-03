export interface Product {
  id: string;
  name: string;
  category: 'books' | 'paper-bags' | 'stationery' | 'art-supplies' | 'drawings' | 'decor' | string;
  price: number;
  originalPrice: number;
  stockCopies: number;
  condition: 'Like New' | 'Gently Read' | 'Handmade' | 'Custom Made' | 'Good Condition' | 'Pristine';
  description: string;
  imageUrl: string;
  authorOrMaker?: string;
  featured?: boolean;
  bestseller?: boolean;
  tags?: string[];
  specifications?: Record<string, string>;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  badge?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  instagramHandle: string;
  instagramUrl: string;
  upiId: string;
  upiQrImageUrl: string;
  announcement: string;
  city: string;
  freeShippingThreshold: number;
  adminPin: string;
  ownerEmail: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface InquiryRecord {
  id: string;
  type: 'single_chat_to_buy' | 'cart_checkout';
  timestamp: string;
  productNames: string;
  totalAmount: number;
  rawMessage: string;
  status: 'Inquired' | 'Confirmed' | 'Paid' | 'Dispatched';
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'stock' | 'discount';
