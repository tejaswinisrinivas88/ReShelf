import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Instagram, MapPin, QrCode, Lock, Heart, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setSelectedCategory, setActiveView, setIsUpiModalOpen, isAdmin, logoutAdmin } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1A3021] text-[#E8DFD3] border-t border-[#294B33] text-xs">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand Wordmark & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-white block">
              ReShelf
            </span>
            <span className="font-hand text-lg text-[#E09F3E] block">
              ~ A sanctuary for Hyderabad readers & conscious living ~
            </span>
            <p className="text-[#C4B7A5] text-xs leading-relaxed max-w-sm font-sans">
              An affordable and eco-friendly marketplace for Hyderabad. We keep pre-loved books in circulation at half price, supply custom kraft paper bags to local cafes and stores, and celebrate sustainable artisans.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#274431] hover:bg-[#345941] text-[#E8DFD3] flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#274431] hover:bg-[#345941] text-[#9BC18E] flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsUpiModalOpen(true)}
                className="w-8 h-8 rounded-full bg-[#274431] hover:bg-[#345941] text-[#E09F3E] flex items-center justify-center transition-colors"
                title="UPI Details"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-wider uppercase text-white">
              Collections
            </h4>
            <ul className="space-y-2 text-[#BFB5A7]">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('books');
                    setActiveView('store');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Pre-Loved Books (50% Off)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('paper-bags');
                    setActiveView('store');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Custom Paper Bags
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('stationery');
                    setActiveView('store');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Eco Stationery
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('art-supplies');
                    setActiveView('store');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Art & Paints
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('drawings');
                    setActiveView('store');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Handmade Drawings
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('decor');
                    setActiveView('store');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Home Décor
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Payment */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-white">
              Hyderabad Delivery
            </h4>
            <ul className="space-y-2 text-[#BFB5A7]">
              <li>
                <button
                  onClick={() => setIsUpiModalOpen(true)}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#E5B582]" />
                  <span>How UPI Payment Works</span>
                </button>
              </li>
              <li>Free delivery on orders &gt; ₹{settings.freeShippingThreshold}</li>
              <li>Same-day dispatch in Hyderabad</li>
              <li>Zero plastic, 100% paper parcel</li>
              <li>Bulk Bag Pricing for Cafes</li>
            </ul>
          </div>

          {/* Column 4: Contact & Owner Portal */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-white">
              Connect Directly
            </h4>
            <div className="space-y-2 text-[#BFB5A7]">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#88D49E]" />
                <span className="font-mono">{settings.whatsappNumber}</span>
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-[#E5B582]" />
                <span>{settings.instagramHandle}</span>
              </a>
              <div className="flex items-center gap-2 text-[#A89D8F]">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{settings.city}</span>
              </div>
            </div>

            {/* Admin entry point in footer */}
            <div className="pt-3 border-t border-[#294633]">
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView('admin')}
                    className="text-white hover:underline text-[11px] font-semibold flex items-center gap-1"
                  >
                    <span>Open Admin Dashboard</span>
                  </button>
                  <span className="text-[#4E775B]">·</span>
                  <button
                    onClick={logoutAdmin}
                    className="text-[#BFB5A7] hover:underline text-[11px]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveView('admin')}
                  className="text-[#9E9080] hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Lock className="w-3 h-3" />
                  <span>Store Owner Access</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="mt-12 pt-8 border-t border-[#294633] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#8C9E91] text-[11px]">
          <div className="flex items-center gap-2">
            <span>© 2026 ReShelf Hyderabad. All rights reserved.</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-[#E5B582]">
              Made with <Heart className="w-3 h-3 fill-current" /> for sustainable reading
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>UPI Verified Store</span>
            <span>·</span>
            <button
              onClick={scrollToTop}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
