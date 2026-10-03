import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { generateSingleProductWhatsAppUrl } from '../utils/whatsapp';
import { ShoppingBag, MessageSquare, Heart, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    settings, 
    addToCart, 
    toggleWishlist, 
    isWishlisted, 
    setQuickViewProduct,
    logInquiry 
  } = useStore();

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleChatToBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateSingleProductWhatsAppUrl(settings.whatsappNumber, product);
    
    // Log inquiry for owner reference
    logInquiry({
      type: 'single_chat_to_buy',
      productNames: `${product.name} (₹${product.price})`,
      totalAmount: product.price,
      rawMessage: `Hi ReShelf, is ${product.name} available for ₹${product.price}?`,
      status: 'Inquired',
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const isLowStock = product.stockCopies > 0 && product.stockCopies <= 2;
  const isOutOfStock = product.stockCopies <= 0;

  return (
    <div
      onClick={() => setQuickViewProduct(product)}
      className="group relative flex flex-col bg-white border border-[#E0D3C1] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer shadow-2xs"
    >
      {/* Visual Asset Container (Lead with imagery) */}
      <div className="relative aspect-4/3 sm:aspect-3/3 bg-[#F4ECE0] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80';
          }}
          referrerPolicy="no-referrer"
        />

        {/* Subtle Discount Tag in Autumn Rust */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="bg-[#B8532A] text-white text-[10px] font-serif font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#584539] hover:text-[#B8532A] shadow-xs transition-colors"
          title="Save to Wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted(product.id) ? 'fill-[#B8532A] text-[#B8532A]' : ''
            }`}
          />
        </button>

        {/* Quick View Overlay Affordance */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-[#233E2B] text-xs font-serif font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow p-4">
        
        {/* Zero-Pill Clean Metadata with · Separators */}
        <div className="flex items-center gap-2 text-[11px] text-[#7C6758] uppercase tracking-wider mb-1 font-sans">
          <span>{product.category.replace('-', ' ')}</span>
          <span aria-hidden="true">·</span>
          <span>{product.condition}</span>
        </div>

        {/* Product Title with rustic serif font */}
        <h3 className="font-serif text-base sm:text-lg font-bold text-[#233E2B] line-clamp-1 group-hover:text-[#182C1F] transition-colors">
          {product.name}
        </h3>

        {/* Author or Artisan */}
        {product.authorOrMaker && (
          <p className="text-xs text-[#6E5A4D] truncate mb-2 font-sans">
            by {product.authorOrMaker}
          </p>
        )}

        {/* Available Copies & Stock Badge */}
        <div className="mt-auto pt-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 font-mono text-[11px]">
            {isOutOfStock ? (
              <span className="text-red-700 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Sold Out</span>
              </span>
            ) : isLowStock ? (
              <span className="text-[#B8532A] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8532A] animate-ping" />
                <span>Only {product.stockCopies} {product.stockCopies === 1 ? 'copy' : 'copies'} left</span>
              </span>
            ) : (
              <span className="text-[#2B5438] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{product.stockCopies} copies available</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing with Tabular Numerals */}
        <div className="pt-2 border-t border-[#F0E5D4] mt-2 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-lg font-serif font-bold text-[#233E2B]">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Add to Cart and Chat to Buy in Autumn Meadow */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`py-2 px-2.5 rounded-lg text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition-all ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-[#EFE4D2] hover:bg-[#E4D5BF] text-[#233E2B] active:scale-98 cursor-pointer'
            }`}
            title="Add to shopping cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Add to Cart</span>
          </button>

          <button
            onClick={handleChatToBuy}
            className="py-2 px-2.5 rounded-lg text-xs font-serif font-bold bg-[#233E2B] hover:bg-[#1A3021] text-white flex items-center justify-center gap-1.5 shadow-xs hover:shadow transition-all active:scale-98 cursor-pointer"
            title="Ask owner on WhatsApp if available"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#E09F3E] shrink-0" />
            <span className="truncate">Chat to Buy</span>
          </button>
        </div>

      </div>
    </div>
  );
};
