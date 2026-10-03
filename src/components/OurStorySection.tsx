import React from 'react';
import { useStore } from '../context/StoreContext';
import { Leaf, Heart, Sparkles } from 'lucide-react';

export const OurStorySection: React.FC = () => {
  const { setSelectedCategory } = useStore();

  return (
    <section id="our-story" className="py-16 sm:py-24 bg-[#F8F3EA] border-b border-[#E0D3C1]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Composition (Autumn Meadow warm bookish still life) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-4/3 rounded-xl overflow-hidden shadow-lg border border-[#DECDB7] bg-[#EFE4D2]">
                <img
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80"
                  alt="Aesthetic book stack, linen notebooks, and warm candle"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Offset Autumn Meadow overlay card */}
              <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:-right-8 bg-[#233E2B] text-[#FAF4E8] p-5 sm:p-6 rounded-xl shadow-xl max-w-[250px] hidden sm:block border border-[#3E5C47]">
                <Sparkles className="w-5 h-5 text-[#E09F3E] mb-2" />
                <p className="font-serif text-lg font-bold leading-snug">
                  1,200+ Books recirculated in Hyderabad
                </p>
                <p className="text-[11px] text-[#D8CEBE] mt-1 font-mono">
                  100% Tree-free paper bags supplied
                </p>
                <span className="font-hand text-base text-[#E09F3E] block mt-1 font-bold">
                  ~ sustainable city roots ~
                </span>
              </div>
            </div>
          </div>

          {/* Right Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#B8532A]">
              <Leaf className="w-3.5 h-3.5" />
              <span className="font-serif font-bold">Our Story & Mission</span>
              <span className="font-hand text-base normal-case font-bold">~ slow living ~</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#233E2B] leading-[1.18]">
              For the thinkers, readers & conscious souls of Hyderabad.
            </h2>

            <div className="space-y-4 text-base text-[#574438] leading-relaxed font-sans">
              <p>
                ReShelf began with a belief that great stories and everyday objects should be preserved, cherished, and recirculated rather than discarded.
              </p>
              <p>
                We curate second-hand books at exactly half price so literature remains accessible to students and voracious readers across Hyderabad. Concurrently, we empower local Hyderabad cafes, boutiques, and bakeries to ditch single-use plastic by supplying customizable virgin kraft paper bags.
              </p>
              <p>
                From hand-drawn sketches of Charminar to plantable seed pencils, every item on our shelf celebrates Telangana craftsmanship and slow, mindful consumption.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setSelectedCategory('paper-bags');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#233E2B] hover:bg-[#1A3021] text-[#FAF4E8] px-6 py-3 rounded-lg text-xs font-serif font-bold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
              >
                Shop Sustainable Goods
              </button>

              <div className="flex items-center gap-2 text-xs text-[#6B5749]">
                <Heart className="w-4 h-4 text-[#B8532A] fill-[#B8532A]" />
                <span className="font-hand text-base font-bold">Hand-packed in Hyderabad with compostable twine</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
