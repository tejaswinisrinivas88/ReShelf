import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { generateSingleProductWhatsAppUrl } from '../utils/whatsapp';
import { 
  X, 
  ShoppingBag, 
  MessageSquare, 
  Heart, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  Copy
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    settings, 
    addToCart, 
    toggleWishlist, 
    isWishlisted,
    logInquiry,
    showToast 
  } = useStore();

  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isOutOfStock = product.stockCopies <= 0;
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleChatToBuy = () => {
    const url = generateSingleProductWhatsAppUrl(settings.whatsappNumber, product);
    logInquiry({
      type: 'single_chat_to_buy',
      productNames: `${product.name} (₹${product.price})`,
      totalAmount: product.price,
      rawMessage: `Hi ReShelf, is ${product.name} available for ₹${product.price}?`,
      status: 'Inquired',
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on ReShelf Hyderabad for ₹${product.price}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div 
        className="relative bg-[#F8F3EA] border border-[#E0D3C1] rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-black shadow-xs transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* Media Column (Left) */}
          <div className="md:col-span-5 bg-[#F1E5D3] p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-[#DECDB7]">
            <div className="w-full aspect-4/5 max-w-[280px] rounded-lg overflow-hidden shadow-md bg-white border border-[#DECDB7]">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80';
                }}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Condition & Hyderabad note */}
            <div className="mt-4 w-full text-center space-y-1">
              <span className="inline-block bg-[#233E2B] text-[#FAF4E8] text-xs font-serif font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.condition}
              </span>
              <p className="text-[11px] text-[#786355] font-sans">
                Inspected by ReShelf Hyderabad Curators
              </p>
            </div>
          </div>

          {/* Details Column (Right) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col">
            
            <div className="flex items-center justify-between text-xs text-[#7A6A61] mb-2 uppercase tracking-wider font-sans">
              <span>{product.category.replace('-', ' ')}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-1.5 hover:text-[#233E2B] transition-colors"
                  title="Share item"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-1.5 hover:text-[#B8532A] transition-colors"
                  title="Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted(product.id) ? 'fill-[#B8532A] text-[#B8532A]' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#233E2B] leading-tight mb-1">
              {product.name}
            </h2>

            {product.authorOrMaker && (
              <p className="text-sm text-[#665245] mb-4 font-sans">
                by <span className="font-semibold text-[#233E2B]">{product.authorOrMaker}</span>
              </p>
            )}

            {/* Price Box */}
            <div className="bg-[#EFE4D2] p-3.5 rounded-lg border border-[#DECDB7] flex items-baseline justify-between mb-4">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl font-bold text-[#233E2B] font-mono tabular-nums">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-stone-500 line-through font-mono">
                    ₹{product.originalPrice}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-serif font-bold text-[#B8532A] bg-white px-2 py-0.5 rounded shadow-2xs">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="text-xs font-mono">
                {isOutOfStock ? (
                  <span className="text-red-700 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Out of Stock</span>
                  </span>
                ) : (
                  <span className="text-[#26402F] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{product.stockCopies} {product.stockCopies === 1 ? 'copy' : 'copies'} left</span>
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="text-sm text-[#4E3F35] leading-relaxed mb-6 space-y-2">
              <p>{product.description}</p>
            </div>

            {/* Specifications if any */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-6 pt-4 border-t border-[#E6D9C5]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Item Specifications
                </h4>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex flex-col">
                      <dt className="text-stone-500">{key}:</dt>
                      <dd className="font-medium text-[#26402F]">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Quantity Stepper & Buy Actions */}
            <div className="mt-auto pt-4 border-t border-[#E6D9C5] space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-stone-600">Quantity:</span>
                <div className="flex items-center border border-[#D5C2A2] rounded-md bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-2.5 py-1 text-sm text-stone-600 hover:bg-stone-100 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono font-semibold min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCopies, quantity + 1))}
                    disabled={quantity >= product.stockCopies || isOutOfStock}
                    className="px-2.5 py-1 text-sm text-stone-600 hover:bg-stone-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`py-3 px-4 rounded-lg font-serif font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-[#EFE4D2] hover:bg-[#E4D5BF] text-[#233E2B]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleChatToBuy}
                  className="py-3 px-4 rounded-lg font-serif font-bold text-sm bg-[#233E2B] hover:bg-[#1A3021] text-white flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#E09F3E]" />
                  <span>Chat to Buy (WhatsApp)</span>
                </button>
              </div>

              {/* Hyderabad Delivery Guarantee */}
              <div className="flex items-center gap-2 text-xs text-[#6B5749] pt-2 font-sans">
                <Truck className="w-4 h-4 text-[#233E2B]" />
                <span>Hand-delivered across Hyderabad. Free on orders above ₹{settings.freeShippingThreshold}.</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
