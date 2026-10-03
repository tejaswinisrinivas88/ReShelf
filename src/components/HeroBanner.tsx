import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles, BookOpen, ShoppingBag, ShieldCheck, Heart, MapPin } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, setActiveView } = useStore();

  const handleShopNow = () => {
    setActiveView('store');
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePaperBagsInquiry = () => {
    setActiveView('store');
    setSelectedCategory('paper-bags');
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#F8F3EA] border-b border-[#E0D3C1]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-18 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="md:col-span-6 lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE4D2] border border-[#DECDB7] text-xs font-medium text-[#233E2B]">
              <Sparkles className="w-3.5 h-3.5 text-[#B8532A]" />
              <span className="font-serif font-bold text-xs">Hyderabad's Circular Reading & Eco Marketplace</span>
              <span className="font-hand text-sm text-[#B8532A] font-bold hidden sm:inline">~ slow living ~</span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-tight text-[#233E2B] leading-[1.14] text-balance">
                Some Things <br />
                <span className="italic font-normal text-[#B8532A]">Deserves Second Life.</span>
              </h1>
              
              <p className="text-sm sm:text-base lg:text-lg text-[#584539] max-w-xl leading-relaxed font-sans">
                Curated second-hand books at half price, customized kraft paper bags for local businesses, and sustainable artisan stationery — thoughtfully delivered across Hyderabad.
              </p>

              {/* Hand-drawn rustic note */}
              <div className="flex items-center gap-2 pt-0.5">
                <span className="font-hand text-lg sm:text-xl text-[#B8532A] font-bold -rotate-1">
                  ✎ "Every pre-loved book has another lifetime of wisdom to give"
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleShopNow}
                className="bg-[#233E2B] hover:bg-[#1A3021] text-[#FAF4E8] px-6 py-3 rounded-lg text-xs sm:text-sm font-serif font-bold tracking-wide shadow-xs hover:shadow-md transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>EXPLORE ALL GOODS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#E09F3E]" />
              </button>

              <button
                onClick={handlePaperBagsInquiry}
                className="bg-[#EFE4D2] hover:bg-[#E4D5BF] text-[#233E2B] border border-[#DECDB7] px-5 py-3 rounded-lg text-xs sm:text-sm font-serif font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
              >
                <ShoppingBag className="w-4 h-4 text-[#B8532A]" />
                <span>Custom Bags for Cafes & Shops</span>
              </button>
            </div>

            {/* Quick trust metrics in Autumn Meadow */}
            <div className="pt-6 border-t border-[#E0D3C1] grid grid-cols-3 gap-3 text-left">
              <div className="bg-[#FAF4E8] p-3 rounded-lg border border-[#E6D9C5]">
                <span className="block font-serif text-xl sm:text-2xl font-bold text-[#233E2B] font-mono tabular-nums">50%</span>
                <span className="text-[11px] text-[#735F52]">Off Cover Price</span>
              </div>
              <div className="bg-[#FAF4E8] p-3 rounded-lg border border-[#E6D9C5]">
                <span className="block font-serif text-xl sm:text-2xl font-bold text-[#233E2B]">100%</span>
                <span className="text-[11px] text-[#735F52]">Plastic-Free Parcel</span>
              </div>
              <div className="bg-[#FAF4E8] p-3 rounded-lg border border-[#E6D9C5]">
                <span className="block font-serif text-xl sm:text-2xl font-bold text-[#233E2B]">₹0</span>
                <span className="text-[11px] text-[#735F52]">Free Shipping &gt; ₹699</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase (Generously balances the right space) */}
          <div className="md:col-span-6 lg:col-span-6 relative mt-4 md:mt-0">
            <div className="relative mx-auto w-full">
              
              {/* Decorative Autumn Meadow warm shadow backdrop */}
              <div className="absolute -inset-2 sm:-inset-3 bg-[#E4D2B8] rounded-2xl transform rotate-1 -z-10 shadow-xs" />
              
              <div className="overflow-hidden rounded-xl border border-[#DECDB7] bg-white shadow-xl relative aspect-4/3 sm:aspect-16/11">
                <img
                  src="/src/assets/images/hero_books_curation_1791033854661.jpg"
                  alt="Curated books, warm ceramic tea mug, and eco-friendly notebooks on a sunlit desk"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80';
                  }}
                  referrerPolicy="no-referrer"
                />

                {/* Floating Product Highlight Card on the image */}
                <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto bg-[#FAF4E8]/95 backdrop-blur-md border border-[#DECDB7] p-3 rounded-lg shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#233E2B] flex items-center justify-center text-white shrink-0">
                    <BookOpen className="w-5 h-5 text-[#E09F3E]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-serif font-bold text-[#233E2B] truncate">
                      The Midnight Library · ₹249
                    </p>
                    <p className="text-[10px] text-stone-600 truncate font-sans">
                      Condition: Like New · Hyderabad Hand-Delivery
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary floating badge on right edge */}
              <div className="hidden sm:flex absolute -top-3 -right-3 bg-[#B8532A] text-white py-1.5 px-3.5 rounded-full text-[11px] font-serif font-bold shadow-md items-center gap-1.5 border border-[#9E431E]">
                <Sparkles className="w-3.5 h-3.5 text-[#F6DFB8]" />
                <span>Save 50% on Bestsellers</span>
              </div>

              {/* Companion mini banner below image to ground the right column */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-[#EFE4D2] p-3 rounded-lg border border-[#DECDB7] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#233E2B] text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#E09F3E]" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-serif font-bold text-xs text-[#233E2B] block truncate">
                      Hyderabad Wide Delivery
                    </span>
                    <span className="text-[10px] text-[#735F52] block truncate">
                      Banjara Hills, Gachibowli & more
                    </span>
                  </div>
                </div>

                <div className="bg-[#EFE4D2] p-3 rounded-lg border border-[#DECDB7] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#B8532A] text-white flex items-center justify-center shrink-0">
                    <Heart className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-serif font-bold text-xs text-[#233E2B] block truncate">
                      Hand-inspected Spines
                    </span>
                    <span className="text-[10px] text-[#735F52] block truncate">
                      Intact pages guaranteed
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
