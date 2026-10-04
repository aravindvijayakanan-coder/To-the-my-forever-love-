import React from 'react';
import { Heart, Sparkles, ArrowUp } from 'lucide-react';

interface FinalMessageProps {
  title: string;
  content: string[];
  signature: string;
  myName: string;
  onBackToTop: () => void;
}

export const FinalMessage: React.FC<FinalMessageProps> = ({
  title,
  content,
  signature,
  myName,
  onBackToTop,
}) => {
  return (
    <section id="final-message" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      {/* Background Soft Candlelight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-900/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative Top Accent */}
      <div className="inline-flex items-center justify-center gap-2 mb-8 text-rose-400/80">
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span className="font-serif italic text-lg sm:text-xl text-rose-200">
          Happy Birthday, My Love
        </span>
        <Sparkles className="w-4 h-4 text-amber-300" />
      </div>

      {/* Main Title */}
      <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight text-glow-rose mb-8 leading-tight">
        {title || 'Happy Birthday, My Entire Universe'}
      </h2>

      {/* Message paragraphs */}
      <div className="space-y-6 max-w-2xl mx-auto font-sans text-base sm:text-lg text-rose-100/80 leading-relaxed font-light">
        {content && content.length > 0 ? (
          content.map((para, i) => <p key={i}>{para}</p>)
        ) : (
          <p>
            May this year bring you as much pure joy, warmth, and peace as you bring into my life every single day.
          </p>
        )}
      </div>

      {/* Signature */}
      <div className="mt-12 pt-8 border-t border-rose-500/15 max-w-md mx-auto space-y-2">
        <p className="font-serif italic text-base sm:text-lg text-rose-300/80">
          {signature || 'With all my love & soul, now and forever.'}
        </p>
        <p className="font-script text-4xl sm:text-5xl text-rose-100 text-glow-rose pt-1">
          {myName || 'Your Husband'}
        </p>
      </div>

      {/* Back to top interaction */}
      <div className="mt-16">
        <button
          onClick={onBackToTop}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-rose-400/25 bg-rose-950/40 hover:bg-rose-900/50 text-rose-200 text-xs font-sans uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:scale-105"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Relive Our Story</span>
        </button>
      </div>
    </section>
  );
};
