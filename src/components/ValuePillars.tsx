import React from 'react';
import { Heart, Gift, PackageCheck, MapPin } from 'lucide-react';

export const ValuePillars: React.FC = () => {
  const pillars = [
    {
      icon: Heart,
      title: 'Curated with Love',
      description: 'Every pre-loved book is hand-checked for intact spines and pristine reading pages.',
      tag: 'Hand-picked',
    },
    {
      icon: Gift,
      title: 'Perfect for Gifting',
      description: 'Handmade bookmarks, art supplies & scented candles wrapped in cotton twine.',
      tag: 'Artisan craft',
    },
    {
      icon: PackageCheck,
      title: 'Zero Plastic Packaging',
      description: '100% biodegradable kraft bags and recycled carton padding for every Hyderabad order.',
      tag: '100% Eco',
    },
    {
      icon: MapPin,
      title: 'Hyderabad Fast Delivery',
      description: 'Doorstep hand-delivery across Gachibowli, Banjara Hills, Secunderabad & more.',
      tag: 'Local care',
    },
  ];

  return (
    <div className="bg-[#F8F3EA] border-b border-[#E0D3C1] py-8 sm:py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="flex flex-col items-center text-center p-3 rounded-lg group transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#EFE4D2] border border-[#DECDB7] flex items-center justify-center text-[#233E2B] mb-3 group-hover:scale-105 group-hover:bg-[#233E2B] group-hover:text-[#FAF4E8] transition-all shadow-2xs">
                  <Icon className="w-5 h-5 transition-colors" />
                </div>
                <h4 className="font-serif text-sm sm:text-base font-bold text-[#233E2B] mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#665245] leading-relaxed max-w-[220px] font-sans">
                  {item.description}
                </p>
                <span className="font-hand text-xs text-[#B8532A] mt-1 font-bold">
                  * {item.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
