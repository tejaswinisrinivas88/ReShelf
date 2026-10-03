import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, MessageSquare, Send, Sparkles, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface UserReview {
  id: string;
  name: string;
  location?: string;
  rating: number;
  comment: string;
  date: string;
}

const STORAGE_KEY = 'reshelf_community_reviews_v1';

export const TestimonialsSection: React.FC = () => {
  const { showToast } = useStore();

  const [reviews, setReviews] = useState<UserReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Save reviews to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name or business name.');
      return;
    }
    if (!comment.trim()) {
      setErrorMsg('Please write your review or feedback.');
      return;
    }

    setErrorMsg('');

    const newReview: UserReview = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      location: location.trim() || 'Hyderabad',
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setReviews(prev => [newReview, ...prev]);
    setSubmittedSuccess(true);
    showToast('Thank you! Your review was submitted successfully.');

    // Reset form fields
    setName('');
    setLocation('');
    setComment('');
    setRating(5);
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return '5 Stars · Exceptional experience';
      case 4:
        return '4 Stars · Great experience';
      case 3:
        return '3 Stars · Good / Satisfied';
      case 2:
        return '2 Stars · Needs improvement';
      case 1:
        return '1 Star · Unsatisfied';
      default:
        return '';
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F1E5D3]/60 border-b border-[#E0D3C1]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="flex items-center justify-center gap-1 text-[#E09F3E] mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#E09F3E]" />
            ))}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#233E2B]">
            What Our Hyderabad Readers & Partners Say
          </h2>
          <p className="text-xs sm:text-sm text-[#735F52] font-hand text-lg">
            ~ real community feedback from Hyderabad book lovers & local shops ~
          </p>
        </div>

        {/* Interactive "Leave Your Review & Rating" Form in Warm Parchment Card */}
        <div className="max-w-2xl mx-auto mb-14">
          <div className="bg-[#F8F3EA] rounded-2xl border border-[#DECDB7] p-6 sm:p-8 shadow-xs relative overflow-hidden">
            
            {/* Top decorative accent */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#DECDB7]/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#233E2B] text-white flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-[#E09F3E]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#233E2B]">
                    Leave Your Review & Rating
                  </h3>
                  <p className="text-xs text-[#7A6658] font-sans">
                    Share your experience with our pre-loved books, kraft bags, or art supplies.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline font-hand text-sm text-[#B8532A] font-bold">
                ~ reader voice ~
              </span>
            </div>

            {/* Success Confirmation Notice */}
            {submittedSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-[#E2ECE3] border border-[#A5CEAC] text-[#233E2B] flex items-start gap-3 animate-in fade-in duration-300">
                <CheckCircle2 className="w-5 h-5 text-[#233E2B] shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p className="font-serif font-bold text-sm">
                    Thank you for your feedback! Your review has been submitted for approval.
                  </p>
                  <p className="text-stone-600 font-sans">
                    Your contribution helps our sustainable Hyderabad community grow.
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* 1. Interactive Star Rating Selector */}
              <div>
                <label className="block text-xs font-serif font-bold text-[#233E2B] mb-1.5">
                  Star Rating <span className="text-[#B8532A]">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isFilled = (hoverRating || rating) >= starValue;
                    return (
                      <button
                        type="button"
                        key={starValue}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-[#E09F3E] hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                        aria-label={`Rate ${starValue} stars`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled ? 'fill-[#E09F3E] text-[#E09F3E]' : 'text-[#D0BD9F]'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 font-mono text-xs font-semibold text-[#786457]">
                    {getRatingLabel(hoverRating || rating)}
                  </span>
                </div>
              </div>

              {/* 2. Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-serif font-bold text-[#233E2B] mb-1">
                    Your Name / Business Name <span className="text-[#B8532A]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="e.g. Radhika V. or Roastery Coffee Cafe"
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#DECDB7] rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#233E2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-[#233E2B] mb-1">
                    Hyderabad Locality (optional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Banjara Hills, Gachibowli, Secunderabad"
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#DECDB7] rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#233E2B]"
                  />
                </div>
              </div>

              {/* Review Textarea */}
              <div>
                <label className="block text-xs font-serif font-bold text-[#233E2B] mb-1">
                  Write your review or feedback... <span className="text-[#B8532A]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Tell other readers about the condition of the books, custom paper bags for your store, packaging quality, or WhatsApp coordinator experience..."
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#DECDB7] rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#233E2B] leading-relaxed resize-y"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>
              )}

              {/* 3. Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#7E6A5E] font-sans">
                  * All reviews are verified for Hyderabad community trust
                </span>

                <button
                  type="submit"
                  className="bg-[#233E2B] hover:bg-[#1A3021] text-[#FAF4E8] px-6 py-3 rounded-lg text-xs font-serif font-bold tracking-wider uppercase transition-all shadow-xs hover:shadow flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <Send className="w-3.5 h-3.5 text-[#E09F3E]" />
                  <span>Submit Review</span>
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Display Dynamic Reviews List */}
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#DECDB7]">
            <h3 className="font-serif text-lg font-bold text-[#233E2B] flex items-center gap-2">
              <span>Community Reviews</span>
              <span className="text-xs bg-[#EFE4D2] text-[#233E2B] px-2 py-0.5 rounded-full font-mono">
                {reviews.length}
              </span>
            </h3>
            <span className="text-xs text-[#7A6658] font-sans">
              Authentic customer testimonials
            </span>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12 px-4 bg-[#F8F3EA]/70 rounded-xl border border-dashed border-[#DECDB7] max-w-md mx-auto">
              <Sparkles className="w-8 h-8 text-[#D0BD9F] mx-auto mb-2" />
              <h4 className="font-serif text-base font-bold text-[#342721] mb-1">
                No reviews yet
              </h4>
              <p className="text-xs text-[#6E5A4D] leading-relaxed font-sans">
                Be the first to share your thoughts about ReShelf second-hand books, custom paper bags, or Hyderabad artisan stationery!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 rounded-xl border border-[#DECDB7] shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    {/* Stars & Date */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-0.5 text-[#E09F3E]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'fill-[#E09F3E] text-[#E09F3E]'
                                : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {rev.date}
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="text-xs sm:text-sm text-[#443329] leading-relaxed mb-4 font-serif">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Reviewer info */}
                  <div className="pt-3 border-t border-[#F0E5D4] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#EFE4D2] text-[#233E2B] flex items-center justify-center font-bold text-[10px] font-mono">
                        {rev.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="font-serif font-bold text-[#233E2B] text-xs leading-tight">
                          {rev.name}
                        </h5>
                        {rev.location && (
                          <p className="text-[10px] text-stone-500 font-sans">{rev.location}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-[9px] bg-[#EFE4D2] text-[#233E2B] font-semibold px-2 py-0.5 rounded-full font-sans">
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
