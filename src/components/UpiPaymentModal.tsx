import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, QrCode, Copy, CheckCircle2, ShieldCheck, PhoneCall } from 'lucide-react';

export const UpiPaymentModal: React.FC = () => {
  const { isUpiModalOpen, setIsUpiModalOpen, settings, showToast } = useStore();

  if (!isUpiModalOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(settings.upiId);
    showToast(`Copied UPI ID: ${settings.upiId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="relative bg-[#F8F3EA] border border-[#DECDB7] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsUpiModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-[#EFE4D2] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#233E2B] text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
            <QrCode className="w-6 h-6 text-[#E09F3E]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#233E2B]">
            UPI Payment Information
          </h3>
          <p className="text-xs text-[#6E5A4D] max-w-xs mx-auto font-sans">
            Zero transaction fees for Hyderabad readers & small businesses.
          </p>
        </div>

        {/* QR Code Graphic Box */}
        <div className="mt-6 p-5 bg-white border border-[#DECDB7] rounded-xl shadow-2xs flex flex-col items-center">
          {settings.upiQrImageUrl ? (
            <img
              src={settings.upiQrImageUrl}
              alt="ReShelf UPI QR Code"
              className="w-48 h-48 object-contain rounded-lg border border-[#DECDB7] p-2"
            />
          ) : (
            <div className="w-48 h-48 bg-[#F8F3EA] border border-[#DECDB7] rounded-lg flex flex-col items-center justify-center p-3 text-center">
              {/* Fallback Vector QR representation */}
              <div className="relative p-2 bg-white rounded border border-[#DECDB7] shadow-2xs">
                <svg viewBox="0 0 100 100" className="w-32 h-32 text-[#233E2B] fill-current">
                  <rect x="10" y="10" width="25" height="25" fill="#233E2B" />
                  <rect x="15" y="15" width="15" height="15" fill="#F8F3EA" />
                  <rect x="18" y="18" width="9" height="9" fill="#233E2B" />

                  <rect x="65" y="10" width="25" height="25" fill="#233E2B" />
                  <rect x="70" y="15" width="15" height="15" fill="#F8F3EA" />
                  <rect x="73" y="18" width="9" height="9" fill="#233E2B" />

                  <rect x="10" y="65" width="25" height="25" fill="#233E2B" />
                  <rect x="15" y="70" width="15" height="15" fill="#F8F3EA" />
                  <rect x="18" y="73" width="9" height="9" fill="#233E2B" />

                  <rect x="42" y="12" width="6" height="6" />
                  <rect x="52" y="12" width="6" height="6" />
                  <rect x="42" y="24" width="6" height="6" />
                  <rect x="52" y="24" width="6" height="6" />

                  <rect x="12" y="42" width="6" height="6" />
                  <rect x="24" y="42" width="6" height="6" />
                  <rect x="12" y="52" width="6" height="6" />
                  <rect x="24" y="52" width="6" height="6" />

                  <rect x="42" y="42" width="16" height="16" fill="#B8532A" />
                  <rect x="65" y="45" width="8" height="8" />
                  <rect x="78" y="45" width="8" height="8" />
                  <rect x="45" y="68" width="8" height="8" />
                  <rect x="58" y="68" width="8" height="8" />
                  <rect x="70" y="68" width="18" height="18" />
                </svg>
              </div>
              <span className="text-[10px] text-stone-500 font-mono mt-1">Scan via any UPI App</span>
            </div>
          )}

          {/* Copyable UPI VPA */}
          <div className="mt-4 w-full flex items-center justify-between p-2.5 bg-[#F8F3EA] border border-[#DECDB7] rounded-lg">
            <div className="text-left truncate mr-2">
              <span className="text-[10px] uppercase text-[#7E695B] font-semibold block font-sans">Store UPI ID</span>
              <span className="font-mono text-xs sm:text-sm font-bold text-[#233E2B] truncate block">
                {settings.upiId}
              </span>
            </div>
            <button
              onClick={handleCopyUpi}
              className="p-1.5 text-stone-600 hover:text-[#233E2B] hover:bg-[#EFE4D2] rounded transition-colors shrink-0 flex items-center gap-1 text-xs cursor-pointer font-sans"
              title="Copy UPI ID"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Copy</span>
            </button>
          </div>

          <p className="text-[11px] text-stone-400 mt-2 font-sans">
            Accepted: PhonePe · Google Pay · Paytm · BHIM · Cred · Any Bank UPI
          </p>
        </div>

        {/* 3-Step Manual Flow Explanation */}
        <div className="mt-5 space-y-2 text-xs text-[#5C4D44] font-sans">
          <h4 className="font-serif font-bold text-[#233E2B] text-xs uppercase tracking-wider">
            How Payments Work on ReShelf
          </h4>
          <ol className="space-y-1.5 list-decimal list-inside text-[#6E5A4D]">
            <li>Owner manually checks book physical copy on the shelf.</li>
            <li>Owner chats with you on WhatsApp, asks for your Hyderabad locality, and shares payment details.</li>
            <li>You pay via the QR code above or in WhatsApp and reply with screenshot.</li>
          </ol>
        </div>

        <div className="mt-6 pt-4 border-t border-[#DECDB7] flex items-center justify-between">
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#233E2B] font-serif font-bold hover:underline flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#B8532A]" />
            <span>Chat directly: {settings.whatsappNumber}</span>
          </a>

          <button
            onClick={() => setIsUpiModalOpen(false)}
            className="px-4 py-2 bg-[#233E2B] text-white text-xs font-serif font-bold rounded-lg hover:bg-[#1A3021] cursor-pointer"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
