import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { generateCartWhatsAppUrl } from '../utils/whatsapp';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  MessageSquare, 
  Truck, 
  Info,
  CheckCircle2,
  MapPin,
  Sparkles
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal, 
    cartCount,
    settings,
    logInquiry,
    setIsUpiModalOpen
  } = useStore();

  const [locality, setLocality] = useState('');
  const [notes, setNotes] = useState('');

  if (!isCartOpen) return null;

  const threshold = settings.freeShippingThreshold;
  const isFreeShipping = cartTotal >= threshold;
  const neededForFreeShipping = Math.max(0, threshold - cartTotal);
  const progressPercent = Math.min(100, Math.round((cartTotal / threshold) * 100));

  const handleCheckoutViaWhatsApp = () => {
    if (cart.length === 0) return;

    const url = generateCartWhatsAppUrl(
      settings.whatsappNumber,
      cart,
      cartTotal,
      locality,
      notes
    );

    // Log the cart inquiry
    const itemSummary = cart
      .map(i => `${i.product.name} (x${i.quantity})`)
      .join(', ');

    logInquiry({
      type: 'cart_checkout',
      productNames: itemSummary,
      totalAmount: cartTotal,
      rawMessage: `Cart order with ${cartCount} items for ₹${cartTotal}`,
      status: 'Inquired',
    });

    // Open WhatsApp
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8F3EA] border-l border-[#DECDB7] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-[#DECDB7] bg-[#F1E5D3] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#233E2B]" />
              <h2 className="font-serif text-xl font-bold text-[#233E2B]">Your Bag</h2>
              <span className="text-xs bg-[#233E2B] text-[#FAF4E8] px-2 py-0.5 rounded-full font-mono font-bold">
                {cartCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#E4D5BF] text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hyderabad Free Shipping Progress Bar */}
          <div className="bg-[#EFE4D2] px-5 py-3 border-b border-[#DECDB7] text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[#544237] font-medium flex items-center gap-1.5 font-sans">
                <Truck className="w-4 h-4 text-[#233E2B]" />
                {isFreeShipping ? (
                  <span className="text-[#233E2B] font-bold">🎉 You qualify for FREE Hyderabad delivery!</span>
                ) : (
                  <span>Add <strong className="font-mono text-[#233E2B]">₹{neededForFreeShipping}</strong> more for Free Delivery</span>
                )}
              </span>
              <span className="font-mono text-[11px] text-stone-500 font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#DDCAB0] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#233E2B] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#EFE4D2] border border-[#DECDB7] flex items-center justify-center text-[#9E8B79]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#342721]">Your bag is empty</h3>
                <p className="text-xs text-[#6E5A4D] max-w-xs leading-relaxed font-sans">
                  Discover pre-loved books at 50% discount, custom paper bags for your business, and eco stationery.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-[#233E2B] text-[#FAF4E8] px-5 py-2.5 rounded-lg text-xs font-serif font-bold hover:bg-[#1A3021] transition-colors cursor-pointer"
                >
                  Start Exploring Goods
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#DECDB7] shadow-2xs"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-20 object-cover rounded bg-[#F8F3EA] border border-[#DECDB7] shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80';
                      }}
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif text-sm font-bold text-[#233E2B] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-red-600 p-0.5 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#786355] truncate mb-1 font-sans">
                        {item.product.category.replace('-', ' ')} · {item.product.condition}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#DECDB7] rounded bg-[#F8F3EA]">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-stone-600 hover:bg-[#EFE4D2] cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-mono font-bold min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-stone-600 hover:bg-[#EFE4D2] cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-mono text-sm font-bold text-[#B8532A] tabular-nums">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Optional Order Customization */}
                <div className="pt-2 space-y-2 font-sans">
                  <div>
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-[#544237] mb-1">
                      <MapPin className="w-3 h-3 text-[#233E2B]" />
                      <span>Your Hyderabad Area (optional for delivery estimate)</span>
                    </label>
                    <input
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="e.g. Gachibowli, Kukatpally, Banjara Hills, Begumpet"
                      className="w-full text-xs px-3 py-2 bg-white border border-[#DECDB7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#233E2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#544237] mb-1">
                      Order Notes / Business Bag Specifications
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Please check if book has notes, or logo printing query"
                      className="w-full text-xs px-3 py-2 bg-white border border-[#DECDB7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#233E2B]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-stone-500 hover:text-red-700 underline cursor-pointer"
                  >
                    Clear all items
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer & WhatsApp Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#DECDB7] bg-[#F1E5D3] space-y-3">
              
              {/* Summary */}
              <div className="space-y-1.5 text-xs font-sans">
                <div className="flex justify-between text-[#544237]">
                  <span>Subtotal ({cartCount} items):</span>
                  <span className="font-mono font-medium">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-[#544237]">
                  <span>Hyderabad Delivery:</span>
                  <span className="font-mono">
                    {isFreeShipping ? (
                      <span className="text-emerald-800 font-bold">FREE</span>
                    ) : (
                      'Calculated by owner via WhatsApp'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#233E2B] pt-2 border-t border-[#DECDB7]">
                  <span>Total Amount:</span>
                  <span className="font-mono tabular-nums text-[#B8532A]">₹{cartTotal}</span>
                </div>
              </div>

              {/* Workflow Notice */}
              <div className="bg-[#F8F3EA] p-2.5 rounded-lg border border-[#DECDB7] flex items-start gap-2 text-[11px] text-[#5C4B40] leading-relaxed">
                <Info className="w-4 h-4 text-[#233E2B] shrink-0 mt-0.5" />
                <p>
                  <strong>How it works:</strong> Clicking below opens WhatsApp with your complete order. The owner manually confirms availability, confirms your Hyderabad locality, and sends the <strong>UPI QR code</strong> for payment.
                </p>
              </div>

              {/* Checkout Action */}
              <button
                onClick={handleCheckoutViaWhatsApp}
                className="w-full bg-[#233E2B] hover:bg-[#1A3021] text-[#FAF4E8] py-3.5 px-4 rounded-lg font-serif font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#E09F3E]" />
                <span>Confirm & Chat to Buy (₹{cartTotal})</span>
                <ArrowRight className="w-4 h-4 text-[#E09F3E]" />
              </button>

              <div className="text-center">
                <button
                  onClick={() => setIsUpiModalOpen(true)}
                  className="text-[11px] text-[#233E2B] font-serif font-bold hover:underline"
                >
                  View Store UPI QR Code & Payment Info
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
