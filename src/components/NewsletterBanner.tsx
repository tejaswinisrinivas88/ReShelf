import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const NewsletterBanner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
    showToast('Subscribed to Hyderabad book drop alerts!');
  };

  return (
    <section className="bg-[#EFE4D2] border-b border-[#DECDB7] py-12 sm:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F8F3EA] rounded-2xl border border-[#DECDB7] p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left copy */}
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#B8532A] block font-sans">
              Stay Inspired · Hyderabad Book Club
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#233E2B]">
              Get fresh 50% book drops & craft arrivals delivered to your inbox.
            </h3>
            <p className="text-xs sm:text-sm text-[#665245] font-sans">
              Be the first to know when rare fiction, Hyderabad heritage prints, or custom paper bag bundles go live.
            </p>
            <span className="font-hand text-lg text-[#B8532A] block">
              ~ no spam, only bookish goodness and artisan dispatches ~
            </span>
          </div>

          {/* Form */}
          <div className="w-full md:w-auto shrink-0">
            {submitted ? (
              <div className="flex items-center gap-2 bg-[#E2ECE3] text-[#233E2B] border border-[#A5CEAC] px-5 py-3 rounded-lg text-xs font-serif font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#233E2B]" />
                <span>Thank you! You're subscribed to Hyderabad alerts.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#D5C2A2] rounded-lg text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#233E2B]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#233E2B] hover:bg-[#1A3021] text-[#FAF4E8] px-6 py-3 rounded-lg text-xs font-serif font-bold tracking-wider uppercase transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
