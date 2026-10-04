import React from 'react';
import { Heart, Sparkles, Eye } from 'lucide-react';
import { LovePoint } from '../types/personalization';

interface ThingsILoveProps {
  lovePoints: LovePoint[];
  eyesQuote: string;
  eyesNote: string;
  cheeksQuote?: string;
  cheeksNote?: string;
}

export const ThingsILove: React.FC<ThingsILoveProps> = ({
  lovePoints,
  eyesQuote,
  eyesNote,
  cheeksQuote,
  cheeksNote,
}) => {
  return (
    <section id="things-i-love" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-rose-700/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 text-rose-300/80 text-xs font-sans tracking-[0.25em] uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Infinite Reasons</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight text-glow-rose">
          Things I Love About You <span className="text-rose-500">❤️</span>
        </h2>

        <p className="font-sans text-sm sm:text-base text-rose-200/60 font-light leading-relaxed">
          I could spend a hundred lifetimes recounting all the reasons my soul chose yours, but here are just a few of the million things that take my breath away every day.
        </p>
      </div>

      {/* SPECIAL CENTERPIECE: HER EYES */}
      <div className="relative max-w-4xl mx-auto mb-16">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-rose-400/30 bg-gradient-to-br from-rose-950/60 via-purple-950/40 to-black/80 backdrop-blur-xl shadow-2xl">
          {/* Decorative aura */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col items-center text-center space-y-6">
            <div className="w-14 h-14 rounded-full border border-rose-400/40 bg-rose-950/60 flex items-center justify-center text-rose-300 shadow-lg shadow-rose-950/60">
              <Eye className="w-7 h-7 text-rose-300 animate-pulse" />
            </div>

            <span className="font-sans text-xs tracking-[0.3em] uppercase text-rose-300/80 font-medium">
              In Your Eyes
            </span>

            {/* The Mandatory Eyes Quote */}
            <blockquote className="font-serif italic text-2xl sm:text-4xl md:text-4xl text-rose-100 font-light tracking-wide leading-relaxed text-glow-rose max-w-2xl">
              "{eyesQuote || 'I could get lost in your eyes a thousand times, and every time, I’d choose to stay.'}"
            </blockquote>

            {eyesNote && (
              <p className="font-sans text-sm sm:text-base text-rose-200/70 max-w-xl leading-relaxed font-light">
                {eyesNote}
              </p>
            )}

            {/* Cheeks feature when customized */}
            {cheeksQuote && (
              <div className="pt-4 border-t border-rose-500/20 max-w-xl mx-auto space-y-2">
                <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-pink-300/80 font-medium">
                  Your Smile & Cheeks
                </span>
                <p className="font-serif italic text-lg sm:text-2xl text-rose-100 font-light">
                  "{cheeksQuote}"
                </p>
                {cheeksNote && (
                  <p className="font-sans text-xs sm:text-sm text-rose-200/70 font-light">
                    {cheeksNote}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-rose-400/60 pt-2">
              <span className="h-px w-10 bg-rose-400/30" />
              <Heart className="w-4 h-4 text-rose-400 fill-rose-500/40" />
              <span className="h-px w-10 bg-rose-400/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Love Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {lovePoints.map((point, index) => (
          <div
            key={point.id || index}
            className="group relative rounded-2xl p-6 sm:p-7 glass-romantic-card glass-romantic-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-lg text-rose-400/60 font-light tracking-wider">
                  0{index + 1}.
                </span>
                <Heart className="w-4 h-4 text-rose-400/40 group-hover:text-rose-400 group-hover:fill-rose-400/40 group-hover:scale-110 transition-all duration-300" />
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mb-3 group-hover:text-rose-100 transition-colors">
                {point.title}
              </h3>

              <p className="font-sans text-sm text-rose-200/70 leading-relaxed font-light">
                {point.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-rose-500/10 flex items-center text-[11px] text-rose-300/40 tracking-wider uppercase font-sans">
              <span>A piece of my heart</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
