import React, { useState } from 'react';
import { Mail, Heart, Sparkles, X } from 'lucide-react';
import { romanticAudio } from '../utils/audioUtils';

interface LoveLetterProps {
  herName: string;
  myName: string;
  salutation: string;
  paragraphs: string[];
  signoff: string;
}

export const LoveLetter: React.FC<LoveLetterProps> = ({
  herName,
  myName,
  salutation,
  paragraphs,
  signoff,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenEnvelope = () => {
    romanticAudio.playLetterOpen();
    setIsOpen(true);
  };

  const handleCloseEnvelope = () => {
    setIsOpen(false);
  };

  return (
    <section id="love-letter" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Background glow that warms when opened */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
          isOpen ? 'bg-amber-600/15 scale-110' : 'bg-rose-900/15 scale-100'
        }`}
      />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 text-rose-300/80 text-xs font-sans tracking-[0.25em] uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>From My Heart to Yours</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight text-glow-rose">
          A Letter For Your Birthday <span className="text-rose-400">💌</span>
        </h2>

        <p className="font-sans text-sm sm:text-base text-rose-200/60 font-light leading-relaxed">
          Some feelings are too sacred for simple words. Tap the sealed envelope to unveil the letter written for you.
        </p>
      </div>

      {/* ENVELOPE / LETTER CONTAINER */}
      <div className="relative flex flex-col items-center justify-center">
        {!isOpen ? (
          /* SEALED ENVELOPE */
          <div
            onClick={handleOpenEnvelope}
            className="group relative w-full max-w-md sm:max-w-lg aspect-[1.45/1] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:scale-[1.02] shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, #2b0b1a 0%, #17040d 100%)',
              border: '1px solid rgba(251, 113, 133, 0.25)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 35px rgba(225, 29, 72, 0.15)'
            }}
          >
            {/* Envelope Flap Fold Lines */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
              <svg className="w-full h-full opacity-20" viewBox="0 0 400 270" preserveAspectRatio="none">
                <path d="M 0,0 L 200,140 L 400,0" stroke="#f472b6" strokeWidth="1.5" fill="none" />
                <path d="M 0,270 L 200,135 L 400,270" stroke="#f472b6" strokeWidth="1" fill="none" />
              </svg>
            </div>

            {/* Recipient script on envelope */}
            <div className="text-center z-10 space-y-1 mb-6">
              <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-rose-300/60">
                To My Beloved
              </p>
              <p className="font-script text-3xl sm:text-4xl text-rose-100 text-glow-rose">
                {herName || 'My Wife'}
              </p>
            </div>

            {/* WAX SEAL BUTTON */}
            <div className="relative z-20 group-hover:scale-110 transition-transform duration-300">
              <div className="absolute -inset-3 bg-rose-500/30 rounded-full blur-md group-hover:blur-lg transition-all" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-rose-600 via-rose-700 to-rose-950 border-2 border-amber-300/40 shadow-xl flex items-center justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-amber-200/30 flex items-center justify-center">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-amber-200 fill-amber-200/50" />
                </div>
              </div>
            </div>

            {/* Subtle tap instruction */}
            <div className="absolute bottom-5 z-10 flex items-center gap-1.5 text-xs font-sans text-rose-300/70 tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Tap the wax seal to open</span>
            </div>
          </div>
        ) : (
          /* UNFOLDED LETTER */
          <div className="relative w-full max-w-2xl bg-[#faf5eb] text-neutral-900 rounded-2xl p-7 sm:p-12 shadow-2xl border border-amber-900/20 animate-in fade-in zoom-in-95 duration-500">
            {/* Close/Refold Button */}
            <button
              onClick={handleCloseEnvelope}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors cursor-pointer"
              aria-label="Fold letter back into envelope"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Vintage Ornamental Header */}
            <div className="text-center mb-8 border-b border-amber-900/10 pb-6">
              <div className="inline-flex items-center justify-center text-rose-800 mb-2">
                <span className="text-lg">❦</span>
                <Heart className="w-4 h-4 mx-2 fill-rose-800/30 text-rose-800" />
                <span className="text-lg">❦</span>
              </div>
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-neutral-500">
                A love letter written with all my soul
              </p>
            </div>

            {/* Salutation */}
            <div className="mb-6">
              <p className="font-serif italic text-2xl sm:text-3xl text-neutral-800">
                {salutation || `My Dearest ${herName},`}
              </p>
            </div>

            {/* Body Paragraphs */}
            <div className="space-y-4 font-serif text-base sm:text-lg text-neutral-800 leading-relaxed">
              {paragraphs && paragraphs.length > 0 ? (
                paragraphs.map((p, idx) => (
                  <p key={idx} className="first-letter:text-2xl first-letter:font-semibold">
                    {p}
                  </p>
                ))
              ) : (
                <p>Happy Birthday, my love. Every moment with you is a gift.</p>
              )}
            </div>

            {/* Sign-off */}
            <div className="mt-10 pt-6 border-t border-amber-900/10 flex flex-col items-end">
              <p className="font-serif italic text-base sm:text-lg text-neutral-700">
                {signoff || 'Forever and always,'}
              </p>
              <p className="font-script text-3xl sm:text-4xl text-rose-900 mt-1">
                {myName || 'Your Husband'}
              </p>
            </div>

            {/* Subtle Refold CTA */}
            <div className="mt-8 text-center">
              <button
                onClick={handleCloseEnvelope}
                className="text-xs font-sans uppercase tracking-widest text-neutral-500 hover:text-rose-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Fold and seal letter back</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
