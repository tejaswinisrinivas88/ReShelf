import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  BookOpen, 
  ShoppingBag, 
  Pencil, 
  Palette, 
  PenTool, 
  Sparkles, 
  Flame,
} from 'lucide-react';

export const CategorySlider: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, setActiveView } = useStore();

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'books':
        return BookOpen;
      case 'paper-bags':
        return ShoppingBag;
      case 'stationery':
        return Pencil;
      case 'art-supplies':
        return Palette;
      case 'drawings':
        return PenTool;
      case 'decor':
        return Sparkles;
      default:
        return Flame;
    }
  };

  const handleCategoryClick = (slug: string) => {
    setActiveView('store');
    setSelectedCategory(slug);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#F1E5D3]/60 border-b border-[#E0D3C1]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with rustic hand-drawn flourish */}
        <div className="flex items-center justify-center gap-4 mb-8 sm:mb-12">
          <div className="h-[1px] w-12 sm:w-20 bg-[#D4C0A6]" />
          <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-wide uppercase text-[#233E2B] flex items-center gap-2">
            <span>Shop by Collection</span>
            <span className="font-hand text-xl text-[#B8532A] font-bold lowercase tracking-normal">~ explore ~</span>
          </h2>
          <div className="h-[1px] w-12 sm:w-20 bg-[#D4C0A6]" />
        </div>

        {/* Circular Collection Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 sm:gap-6 justify-center">
          
          {/* 'All Items' Circle */}
          <button
            onClick={() => handleCategoryClick('all')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs group-hover:shadow-md ${
              selectedCategory === 'all'
                ? 'bg-[#233E2B] text-white ring-4 ring-[#233E2B]/20 scale-105'
                : 'bg-white text-[#233E2B] border border-[#DECDB7] group-hover:border-[#233E2B] group-hover:scale-105'
            }`}>
              <Sparkles className="w-8 h-8 transition-transform group-hover:rotate-12 text-[#E09F3E]" />
            </div>
            <span className="mt-3 font-serif text-xs sm:text-sm font-bold text-[#443329] group-hover:text-[#233E2B] transition-colors text-center">
              All Items
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            const isSelected = selectedCategory === cat.slug;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs group-hover:shadow-md relative ${
                  isSelected
                    ? 'bg-[#233E2B] text-[#FAF4E8] ring-4 ring-[#233E2B]/20 scale-105'
                    : 'bg-white text-[#233E2B] border border-[#DECDB7] group-hover:border-[#233E2B] group-hover:scale-105'
                }`}>
                  <Icon className="w-8 h-8 transition-transform group-hover:scale-110" />
                  
                  {cat.badge && (
                    <span className="absolute -top-1 right-0 bg-[#B8532A] text-white text-[9px] font-serif font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <span className="mt-3 font-serif text-xs sm:text-sm font-bold text-[#443329] group-hover:text-[#233E2B] transition-colors text-center max-w-[105px] leading-tight">
                  {cat.name}
                </span>
              </button>
            );
          })}

        </div>

      </div>
    </section>
  );
};
