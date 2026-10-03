import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { SortOption } from '../types';
import { generateCartWhatsAppUrl, generateSingleProductWhatsAppUrl } from '../utils/whatsapp';
import { 
  Sparkles, 
  SlidersHorizontal, 
  BookOpen, 
  AlertCircle, 
  RefreshCw, 
  ShoppingBag, 
  MessageSquare, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Package, 
  Plus, 
  Minus, 
  Trash2,
  LayoutGrid,
  Columns2
} from 'lucide-react';

export const CatalogSection: React.FC = () => {
  const { 
    filteredProducts, 
    products,
    categories, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    onlyInStock,
    setOnlyInStock,
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    setIsCartOpen,
    settings,
    setIsUpiModalOpen,
    logInquiry
  } = useStore();

  // Allow toggling between split companion view (which utilizes the right space) and full width grid
  const [viewLayout, setViewLayout] = useState<'split' | 'full'>('split');
  const [customerLocality, setCustomerLocality] = useState('');

  const activeCategoryObj = categories.find(c => c.slug === selectedCategory);

  // Best Selling Books sub-row if 'all' or 'books' is active and no search query
  const bestSellingBooks = products.filter(p => p.category === 'books' && p.bestseller);

  // Pick a featured spotlight product for the right companion panel
  const spotlightProduct = products.find(p => p.featured && p.stockCopies > 0) || products[0];

  const freeShippingLeft = Math.max(0, settings.freeShippingThreshold - cartTotal);
  const freeShippingProgress = Math.min(100, Math.round((cartTotal / settings.freeShippingThreshold) * 100));

  const handleQuickWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const url = generateCartWhatsAppUrl(
      settings.whatsappNumber,
      cart,
      cartTotal,
      customerLocality || 'Hyderabad'
    );

    logInquiry({
      type: 'cart_checkout',
      productNames: cart.map(i => `${i.product.name} (x${i.quantity})`).join(', '),
      totalAmount: cartTotal,
      rawMessage: `Cart order with ${cartCount} items for ₹${cartTotal}`,
      status: 'Inquired',
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSpotlightInquiry = () => {
    if (!spotlightProduct) return;
    const url = generateSingleProductWhatsAppUrl(settings.whatsappNumber, spotlightProduct);
    
    logInquiry({
      type: 'single_chat_to_buy',
      productNames: `${spotlightProduct.name} (₹${spotlightProduct.price})`,
      totalAmount: spotlightProduct.price,
      rawMessage: `Hi ReShelf, is ${spotlightProduct.name} available for ₹${spotlightProduct.price}?`,
      status: 'Inquired',
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="catalog-section" className="py-12 sm:py-16 bg-[#F8F3EA]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Curated Bestselling Books Showcase (Matching Reference Layout) */}
        {selectedCategory === 'all' && !searchQuery && bestSellingBooks.length > 0 && (
          <div className="mb-14 pb-12 border-b border-[#E0D3C1]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#B8532A] block font-sans">
                    Circular Reading · 50% Off Cover Price
                  </span>
                  <span className="font-hand text-sm text-[#B8532A] font-bold hidden sm:inline">
                    ~ verified spines & pages ~
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#233E2B]">
                  Best Selling Second-Hand Books
                </h2>
              </div>
              <button
                onClick={() => setSelectedCategory('books')}
                className="text-xs font-serif font-bold uppercase tracking-wider text-[#233E2B] hover:text-[#B8532A] transition-colors flex items-center gap-1.5 group cursor-pointer"
              >
                <span>View All Books</span>
                <span className="group-hover:translate-x-1 transition-transform">›</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestSellingBooks.slice(0, 4).map((book) => (
                <ProductCard key={book.id} product={book} />
              ))}
            </div>
          </div>
        )}

        {/* Main Catalog Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#B8532A] block font-sans">
                Curated Hyderabad Marketplace
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#233E2B]">
              {selectedCategory === 'all'
                ? 'All Available Goods'
                : activeCategoryObj?.name || 'Collection'}
            </h2>
            <p className="text-xs sm:text-sm text-[#665245] mt-1 max-w-xl font-sans">
              {activeCategoryObj?.description ||
                'Pre-loved literature, bespoke kraft bags for local Hyderabad businesses, zero-waste stationery, and handmade drawings.'}
            </p>
          </div>

          {/* Layout Switcher & Item Count */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <div className="text-xs text-stone-500 font-mono">
              Showing <strong className="text-[#233E2B] font-bold">{filteredProducts.length}</strong> items
            </div>

            {/* Desktop View layout toggle */}
            <div className="hidden lg:flex items-center bg-[#EFE4D2] p-1 rounded-lg border border-[#DECDB7] text-xs">
              <button
                onClick={() => setViewLayout('split')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-all ${
                  viewLayout === 'split'
                    ? 'bg-[#233E2B] text-[#FAF4E8] shadow-2xs'
                    : 'text-[#584539] hover:text-[#233E2B]'
                }`}
                title="Curated View with Right Order Companion"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Curated Split</span>
              </button>

              <button
                onClick={() => setViewLayout('full')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-all ${
                  viewLayout === 'full'
                    ? 'bg-[#233E2B] text-[#FAF4E8] shadow-2xs'
                    : 'text-[#584539] hover:text-[#233E2B]'
                }`}
                title="Full Screen Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px]">Full Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar in Autumn Meadow */}
        <div className="bg-[#EFE4D2] p-2.5 sm:p-3.5 rounded-xl border border-[#DECDB7] mb-8 space-y-3 shadow-2xs">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-lg font-serif font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#233E2B] text-[#FAF4E8] shadow-2xs'
                  : 'text-[#443329] hover:bg-[#E4D5BF]'
              }`}
            >
              All Items
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3.5 py-2 rounded-lg font-serif font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === c.slug
                    ? 'bg-[#233E2B] text-[#FAF4E8] shadow-2xs'
                    : 'text-[#443329] hover:bg-[#E4D5BF]'
                }`}
              >
                <span>{c.name}</span>
                {c.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    selectedCategory === c.slug
                      ? 'bg-[#E09F3E] text-[#233E2B]'
                      : 'bg-[#DECDB7] text-stone-800'
                  }`}>
                    {c.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Secondary Filter Row: Search feedback, Sort, In-Stock Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-[#DECDB7]/80 text-xs">
            
            {/* Search active notice */}
            <div className="flex items-center gap-3">
              {searchQuery && (
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-[#D5C2A2]">
                  <span className="text-stone-500">Search:</span>
                  <span className="font-semibold text-[#233E2B]">"{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 text-stone-400 hover:text-stone-700 text-xs font-bold"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* In-Stock Only Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none text-stone-700 font-medium">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-[#233E2B] focus:ring-[#233E2B] cursor-pointer"
                />
                <span className="font-sans">In-stock copies only</span>
              </label>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[#665245] font-medium font-sans">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-white border border-[#D5C2A2] text-stone-800 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#233E2B] cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Highest Discount %</option>
                <option value="stock">Most Copies in Stock</option>
              </select>
            </div>

          </div>
        </div>

        {/* Dynamic Dual-Column Split Layout (Solves the empty space on the right) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E0D3C1] p-12 text-center max-w-md mx-auto my-8 space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-full bg-[#F8F3EA] border border-[#D8C6AE] flex items-center justify-center mx-auto text-stone-400">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#233E2B]">
              No matching items found
            </h3>
            <p className="text-xs text-[#665245] leading-relaxed">
              We couldn't find items matching your criteria. Try resetting filters or searching for another title.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyInStock(false);
              }}
              className="inline-flex items-center gap-2 bg-[#233E2B] hover:bg-[#1A3021] text-[#FAF4E8] px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${viewLayout === 'split' ? 'lg:grid-cols-12 gap-8' : 'gap-6'}`}>
            
            {/* Left Column: Product Grid */}
            <div className={viewLayout === 'split' ? 'lg:col-span-8 xl:col-span-8.5' : 'w-full'}>
              <div className={`grid gap-4 sm:gap-6 ${
                viewLayout === 'split'
                  ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              }`}>
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>

            {/* Right Column: Hyderabad Literary & Order Companion (Permanently engages the right space!) */}
            {viewLayout === 'split' && (
              <div className="hidden lg:block lg:col-span-4 xl:col-span-3.5 space-y-6">
                
                {/* 1. Live Hyderabad Order Slip & WhatsApp Checkout Card */}
                <div className="bg-white rounded-xl border border-[#E0D3C1] p-5 shadow-2xs space-y-4 sticky top-28">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0E5D4]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#233E2B] text-white flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-[#E09F3E]" />
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#233E2B]">
                          Hyderabad Order Slip
                        </h3>
                        <p className="text-[11px] text-[#786355]">
                          Direct WhatsApp checkout & confirmation
                        </p>
                      </div>
                    </div>
                    <span className="bg-[#EFE4D2] text-[#233E2B] text-xs font-bold px-2 py-0.5 rounded-full font-mono">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Free shipping progress */}
                  <div className="bg-[#FAF6EE] p-3 rounded-lg border border-[#EADCC8] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#4D3C32] flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#233E2B]" />
                        <span>Hyderabad Free Delivery</span>
                      </span>
                      <span className="font-mono text-[11px] font-bold text-[#233E2B]">
                        {freeShippingLeft === 0 ? 'Unlocked!' : `₹${freeShippingLeft} more`}
                      </span>
                    </div>

                    <div className="w-full bg-[#E4D5BF] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#233E2B] h-full transition-all duration-300 rounded-full"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[#806B5D]">
                      {freeShippingLeft === 0
                        ? '🎉 You qualify for free plastic-free hand delivery across Hyderabad!'
                        : `Orders over ₹${settings.freeShippingThreshold} qualify for free doorstep delivery.`}
                    </p>
                  </div>

                  {/* Cart preview list */}
                  {cart.length === 0 ? (
                    <div className="text-center py-6 px-3 bg-[#FAF6EE]/50 rounded-lg border border-dashed border-[#DFD1BD] space-y-2">
                      <BookOpen className="w-7 h-7 text-[#C8B8A0] mx-auto" />
                      <p className="font-serif text-sm text-[#4D3C32] font-semibold">
                        Your bag is waiting for a story
                      </p>
                      <p className="text-[11px] text-[#7E695B] leading-relaxed">
                        Add second-hand books at 50% off or custom paper bags to generate a pre-filled WhatsApp order.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-none">
                        {cart.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex items-center justify-between gap-2 p-2 bg-[#FAF6EE] rounded-lg border border-[#EBE0CF] text-xs"
                          >
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-10 h-10 object-cover rounded bg-stone-100 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-serif font-semibold text-[#233E2B] truncate text-xs">
                                {item.product.name}
                              </p>
                              <p className="font-mono text-[11px] text-[#B8532A] font-bold">
                                ₹{item.product.price} × {item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-5 h-5 rounded bg-white border border-[#D5C2A2] flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                              >
                                <Minus className="w-3 h-3 text-stone-600" />
                              </button>
                              <span className="font-mono font-bold text-xs w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-5 h-5 rounded bg-white border border-[#D5C2A2] flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                              >
                                <Plus className="w-3 h-3 text-stone-600" />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="p-1 text-stone-400 hover:text-red-600 ml-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Customer Locality input for WhatsApp prefill */}
                      <div>
                        <label className="block text-[11px] font-semibold text-[#544237] mb-1">
                          Delivery Locality in Hyderabad:
                        </label>
                        <input
                          type="text"
                          value={customerLocality}
                          onChange={(e) => setCustomerLocality(e.target.value)}
                          placeholder="e.g. Jubilee Hills, Gachibowli, Secunderabad"
                          className="w-full text-xs px-2.5 py-1.5 bg-[#FAF6EE] border border-[#D5C2A2] rounded text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#233E2B]"
                        />
                      </div>

                      {/* Total & WhatsApp Checkout Button */}
                      <div className="pt-2 border-t border-[#F0E5D4] flex items-center justify-between">
                        <span className="font-serif text-sm font-bold text-[#233E2B]">Total Amount:</span>
                        <span className="font-mono text-lg font-bold text-[#B8532A]">₹{cartTotal}</span>
                      </div>

                      <button
                        onClick={handleQuickWhatsAppCheckout}
                        className="w-full py-2.5 px-3 bg-[#233E2B] hover:bg-[#1A3021] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all"
                      >
                        <MessageSquare className="w-4 h-4 text-[#E09F3E]" />
                        <span>Order Bag on WhatsApp</span>
                      </button>

                      <button
                        onClick={() => setIsCartOpen(true)}
                        className="w-full py-1 text-[11px] text-stone-500 hover:text-stone-800 hover:underline text-center"
                      >
                        Open Full Cart Drawer →
                      </button>
                    </div>
                  )}

                  {/* 2. Bespoke Bags Highlight for Hyderabad Businesses */}
                  <div className="pt-4 border-t border-[#F0E5D4]">
                    <div className="bg-[#FAF4E8] rounded-lg p-3.5 border border-[#DECDB7] space-y-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#B8532A]" />
                        <h4 className="font-serif text-xs font-bold text-[#233E2B]">
                          Custom Kraft Bags for Hyderabad Cafes
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#695447] leading-relaxed">
                        Run a local boutique, cafe, or bakery? Ditch plastic with 100% recyclable, logo-printed kraft shopping bags.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedCategory('paper-bags');
                          const catEl = document.getElementById('catalog-section');
                          catEl?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-[11px] font-serif font-bold text-[#B8532A] hover:underline flex items-center gap-1"
                      >
                        <span>View Custom Bag Sizes</span>
                        <span>›</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Curator's Spotlight (50% Off Pick) */}
                  {spotlightProduct && (
                    <div className="pt-4 border-t border-[#F0E5D4] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8532A] font-sans">
                          Curator's Daily Pick
                        </span>
                        <span className="font-hand text-xs text-[#E09F3E] font-bold">50% off cover</span>
                      </div>

                      <div className="flex gap-2.5 items-center p-2 rounded-lg bg-[#FAF6EE] border border-[#E6D9C5]">
                        <img
                          src={spotlightProduct.imageUrl}
                          alt={spotlightProduct.name}
                          className="w-12 h-14 object-cover rounded bg-stone-100 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-serif font-bold text-xs text-[#233E2B] truncate">
                            {spotlightProduct.name}
                          </p>
                          <p className="text-[10px] text-[#735F52] truncate">
                            by {spotlightProduct.authorOrMaker || 'Curated Artisan'}
                          </p>
                          <p className="font-mono text-xs font-bold text-[#B8532A] mt-0.5">
                            ₹{spotlightProduct.price}{' '}
                            <span className="text-[10px] text-stone-400 line-through">
                              ₹{spotlightProduct.originalPrice}
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleSpotlightInquiry}
                        className="w-full py-1.5 text-xs font-semibold bg-[#EFE4D2] hover:bg-[#E4D5BF] text-[#233E2B] rounded flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#233E2B]" />
                        <span>Chat to Buy Spotlight Item</span>
                      </button>
                    </div>
                  )}

                  {/* 4. Trust Badges & Hyderabad Verification */}
                  <div className="pt-3 border-t border-[#F0E5D4] space-y-2 text-[11px] text-[#695447]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#233E2B] shrink-0" />
                      <span>Direct WhatsApp with ReShelf founder</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-[#233E2B] shrink-0" />
                      <span>Plastic-free Hyderabad packaging guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsUpiModalOpen(true)}
                        className="text-[#B8532A] font-serif font-bold hover:underline flex items-center gap-1"
                      >
                        <span>How manual UPI confirmation works →</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
