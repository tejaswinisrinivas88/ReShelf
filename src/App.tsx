import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ValuePillars } from './components/ValuePillars';
import { CategorySlider } from './components/CategorySlider';
import { CatalogSection } from './components/CatalogSection';
import { OurStorySection } from './components/OurStorySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { NewsletterBanner } from './components/NewsletterBanner';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { UpiPaymentModal } from './components/UpiPaymentModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MessageSquare, ShoppingBag, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    activeView, 
    cartCount, 
    cartTotal, 
    setIsCartOpen, 
    settings, 
    toastMessage 
  } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EA] text-[#342721]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#233E2B] text-[#FAF4E8] text-xs font-medium py-3 px-4 rounded-xl shadow-xl border border-[#3A5D44] flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-[#E09F3E]" />
          <span className="font-serif">{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-grow">
        {activeView === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            <HeroBanner />
            <ValuePillars />
            <CategorySlider />
            <CatalogSection />
            <OurStorySection />
            <TestimonialsSection />
            <NewsletterBanner />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Slide-overs */}
      <CartDrawer />
      <ProductDetailModal />
      <UpiPaymentModal />

      {/* Mobile Floating Quick Bar (only on storefront view) */}
      {activeView === 'store' && cartCount > 0 && (
        <div className="sm:hidden fixed bottom-3 inset-x-3 z-30">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#233E2B] text-[#FAF4E8] py-3.5 px-4 rounded-xl shadow-2xl flex items-center justify-between border border-[#3E5C47] active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#E09F3E] text-[#233E2B] font-mono font-bold text-xs flex items-center justify-center">
                {cartCount}
              </div>
              <span className="text-xs font-serif font-bold">View Cart via WhatsApp</span>
            </div>
            <span className="font-mono text-sm font-bold text-[#E09F3E]">
              ₹{cartTotal}
            </span>
          </button>
        </div>
      )}

      {/* Direct WhatsApp Floating Support Button */}
      <div className="fixed bottom-5 right-5 z-30 hidden sm:block">
        <a
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-3.5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all font-medium text-xs group"
          title="Direct WhatsApp with ReShelf Hyderabad"
        >
          <MessageSquare className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
          <span className="font-sans">WhatsApp Support</span>
        </a>
      </div>

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
