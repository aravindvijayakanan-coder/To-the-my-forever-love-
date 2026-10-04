import React from 'react';
import { Heart, Sparkles, ChevronDown } from 'lucide-react';

interface BirthdayHeroProps {
  herName: string;
  birthdayDate: string;
  onExploreClick: () => void;
}

export const BirthdayHero: React.FC<BirthdayHeroProps> = ({
  herName,
  birthdayDate,
  onExploreClick,
}) => {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-16 pb-12 overflow-hidden">
      {/* Cinematic Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/12 rounded-full blur-[140px] pointer-events-none animate-romantic-pulse" />
      <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] bg-fuchsia-800/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Monogram Ribbon */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-400/25 bg-rose-950/40 backdrop-blur-md mb-8 shadow-inner animate-float-gentle">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span className="font-sans text-xs tracking-[0.25em] uppercase text-rose-200/90 font-medium">
          A Celebration of You
        </span>
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
      </div>

      {/* Main Reveal Title */}
      <div className="max-w-4xl mx-auto space-y-4">
        <p className="font-script text-3xl sm:text-5xl md:text-6xl text-rose-300/90 leading-tight select-none">
          Happy Birthday,
        </p>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-tight text-glow-rose leading-[1.08] px-2">
          {herName} <span className="inline-block text-rose-500 animate-pulse">❤️</span>
        </h1>

        {/* The ONLY date displayed: Her Birthday Date */}
        {birthdayDate && (
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-rose-400/40" />
            <div className="font-serif italic text-xl sm:text-2xl md:text-3xl text-rose-200/95 tracking-wide text-glow-gold">
              {birthdayDate}
            </div>
            <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-rose-400/40" />
          </div>
        )}

        <p className="font-sans text-sm sm:text-base text-rose-100/70 max-w-xl mx-auto leading-relaxed pt-2 font-light">
          To my wife, my best friend, my greatest adventure, and the queen of my heart.
          Today the entire universe celebrates the day you were born.
        </p>
      </div>

      {/* Romantic Ring & Heart Motif */}
      <div className="my-10 flex items-center justify-center gap-3 text-rose-400/60">
        <Heart className="w-3 h-3 fill-rose-500/40" />
        <span className="text-sm">💍</span>
        <Heart className="w-3 h-3 fill-rose-500/40" />
      </div>

      {/* Explore Down CTA */}
      <button
        onClick={onExploreClick}
        className="group inline-flex flex-col items-center gap-2 text-rose-300/70 hover:text-rose-100 transition-all cursor-pointer mt-4"
        aria-label="Scroll down to begin our love story"
      >
        <span className="font-sans text-xs tracking-widest uppercase font-medium">
          Step into our world
        </span>
        <div className="w-8 h-8 rounded-full border border-rose-400/30 flex items-center justify-center group-hover:border-rose-300 group-hover:scale-110 transition-transform bg-rose-950/30">
          <ChevronDown className="w-4 h-4 text-rose-300 animate-bounce" />
        </div>
      </button>
    </section>
  );
};
