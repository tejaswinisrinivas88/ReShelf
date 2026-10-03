import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Lock, 
  Menu, 
  X, 
  QrCode, 
  Phone, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    settings, 
    cartCount, 
    setIsCartOpen, 
    wishlist, 
    searchQuery, 
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeView,
    setActiveView,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    setIsUpiModalOpen,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(enteredPin)) {
      setIsAdminPinModalOpen(false);
      setEnteredPin('');
      setPinError('');
      setActiveView('admin');
    } else {
      setPinError('Invalid PIN. Default PIN is 1234');
    }
  };

  const navCategories = [
    { label: 'All Items', slug: 'all' },
    { label: 'Books (50% Off)', slug: 'books' },
    { label: 'Custom Paper Bags', slug: 'paper-bags' },
    { label: 'Eco Stationery', slug: 'stationery' },
    { label: 'Art Supplies', slug: 'art-supplies' },
    { label: 'Handmade Drawings', slug: 'drawings' },
    { label: 'Home Décor', slug: 'decor' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F8F3EA]/95 backdrop-blur-md border-b border-[#E0D3C1] transition-all">
      {/* Top Notice Bar in Deep Autumn Meadow Pine */}
      <div className="bg-[#233E2B] text-[#FAF4E8] text-xs py-2 px-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E09F3E] animate-pulse"></span>
            <span className="font-serif font-bold text-xs truncate">{settings.announcement}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-xs text-[#E1D7C6] shrink-0">
            <button 
              onClick={() => setIsUpiModalOpen(true)}
              className="flex items-center gap-1.5 hover:text-[#E09F3E] transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-[#E09F3E]" />
              <span>UPI Payment Guide</span>
            </button>
            
            <a 
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-[#E09F3E] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#9BC18E]" />
              <span>WhatsApp Support</span>
            </a>

            {isAdmin ? (
              <div className="flex items-center gap-2 border-l border-[#3D5A46] pl-4">
                <button
                  onClick={() => setActiveView(activeView === 'admin' ? 'store' : 'admin')}
                  className="bg-[#B8532A] hover:bg-[#9E4420] text-white px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  {activeView === 'admin' ? 'Back to Store' : 'Admin Panel'}
                </button>
                <button
                  onClick={logoutAdmin}
                  className="hover:underline text-[11px] text-[#D8CEBE]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAdminPinModalOpen(true)}
                className="hover:text-white transition-colors flex items-center gap-1 text-[11px] text-[#C6BBAA]"
              >
                <Lock className="w-3 h-3" />
                <span>Owner Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav Bar conforming to Top Bar Contract */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Zone 1: Wordmark & Identity with Rustic Typography */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveView('store');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-left group cursor-pointer"
            >
              <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#233E2B] group-hover:text-[#1A3021] transition-colors">
                ReShelf
              </span>
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:block text-[10px] tracking-[0.2em] uppercase font-bold text-[#806B5D]">
                  HYDERABAD · CIRCULAR BOOKS & CRAFT
                </span>
                <span className="hidden sm:inline font-hand text-base text-[#B8532A] font-bold">
                  ~ est. 2026 ~
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Space / Subtitle or Clean Divider */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-[#7A6658]">
            <span className="font-hand text-base text-[#B8532A] font-bold">~ Pre-loved books · Custom bags · Eco goods ~</span>
          </div>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Search Trigger or Input */}
            <div className="relative">
              {isSearchVisible ? (
                <div className="flex items-center bg-white border border-[#DCD3C5] rounded-full px-3 py-1.5 shadow-xs w-48 sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books, bags, art..."
                    autoFocus
                    className="w-full text-xs bg-transparent focus:outline-none text-[#2D2522] placeholder:text-stone-400"
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchVisible(false);
                    }}
                    className="text-stone-400 hover:text-stone-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchVisible(true)}
                  className="p-2.5 rounded-full text-[#4A3E38] hover:text-[#233D2D] hover:bg-[#F2ECE0] transition-colors"
                  aria-label="Search items"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                setActiveView('store');
              }}
              className="relative p-2.5 rounded-full text-[#4D3C32] hover:text-[#26402F] hover:bg-[#EFE4D2] transition-colors"
              aria-label="Wishlist"
              title={`${wishlist.length} saved items`}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B8532A]" />
              )}
            </button>

            {/* Shopping Cart Drawer Trigger in Autumn Meadow Pine */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-[#233E2B] hover:bg-[#1A3021] text-[#FAF4E8] px-4 py-2.5 rounded-full shadow-xs hover:shadow transition-all group whitespace-nowrap cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#E09F3E] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-serif font-bold tracking-wide hidden sm:inline">Bag</span>
              <span className="bg-[#FAF4E8] text-[#233E2B] text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center font-mono">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#4D3C32] hover:text-[#26402F] hover:bg-[#EFE4D2] rounded-lg"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6D9C5] bg-[#FAF4E8] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navCategories.map(cat => (
              <button
                key={cat.slug}
                onClick={() => {
                  setActiveView('store');
                  setSelectedCategory(cat.slug);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-[#233D2D] text-white font-medium'
                    : 'text-[#4A3E38] hover:bg-[#F0E8DC]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8DFD1] space-y-2 text-xs">
            <button
              onClick={() => {
                setIsUpiModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-[#4A3E38] hover:text-[#233D2D] w-full py-1.5"
            >
              <QrCode className="w-4 h-4 text-[#233D2D]" />
              <span>UPI Payment Details</span>
            </button>
            
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[#4A3E38] hover:text-[#233D2D] w-full py-1.5"
            >
              <Phone className="w-4 h-4 text-[#233D2D]" />
              <span>WhatsApp Store Owner ({settings.whatsappNumber})</span>
            </a>

            {isAdmin ? (
              <button
                onClick={() => {
                  setActiveView(activeView === 'admin' ? 'store' : 'admin');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center bg-[#233D2D] text-white py-2 rounded-lg font-medium mt-2"
              >
                {activeView === 'admin' ? 'Switch to Storefront' : 'Open Admin Dashboard'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAdminPinModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-stone-500 hover:text-stone-800 w-full py-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>Owner Admin Portal</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Admin PIN Login Modal */}
      {isAdminPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-[#FAF7F2] border border-[#DCD3C5] rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD1]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#233D2D] flex items-center justify-center text-white">
                  <Lock className="w-4 h-4 text-[#E5B582]" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#233D2D]">Owner Admin Login</h3>
              </div>
              <button
                onClick={() => {
                  setIsAdminPinModalOpen(false);
                  setPinError('');
                  setEnteredPin('');
                }}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 mt-3 leading-relaxed">
              Enter the owner PIN to manage products, adjust prices, edit stock copies, and update WhatsApp or UPI QR code settings.
            </p>

            <form onSubmit={handleAdminAuthSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Owner Passcode
                </label>
                <input
                  type="password"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError('');
                  }}
                  placeholder="Enter 4-digit PIN (default: 1234)"
                  maxLength={10}
                  autoFocus
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D2C5B4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#233D2D] font-mono tracking-widest text-center"
                />
                {pinError && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{pinError}</p>
                )}
                <p className="text-[11px] text-stone-500 mt-1.5">
                  Hint: Default PIN is <span className="font-mono font-semibold text-[#233D2D]">1234</span>
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdminPinModalOpen(false)}
                  className="flex-1 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-[#233D2D] hover:bg-[#1A2E22] rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Unlock Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
