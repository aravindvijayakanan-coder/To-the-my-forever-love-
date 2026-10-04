import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface ForeverSectionProps {
  herName: string;
  lines: string[];
}

export const ForeverSection: React.FC<ForeverSectionProps> = ({ herName, lines }) => {
  const [visibleStep, setVisibleStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Progressively reveal the lines with romantic cinematic pauses
          let step = 0;
          const totalSteps = lines.length > 0 ? lines.length : 7;
          const interval = setInterval(() => {
            step++;
            setVisibleStep(step);
            if (step >= totalSteps) {
              clearInterval(interval);
            }
          }, 1100);

          return () => clearInterval(interval);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [lines]);

  const defaultLines = [
    "I don't just want to celebrate your birthday this year…",
    "I want to celebrate every birthday with you.",
    "My Girlfriend.",
    "My Best Friend.",
    "My Home.",
    "My Wife.",
    "My Forever. ❤️💍"
  ];

  const activeLines = lines && lines.length > 0 ? lines : defaultLines;

  return (
    <section
      ref={sectionRef}
      id="forever"
      className="relative min-h-[90vh] py-28 px-4 sm:px-6 flex flex-col items-center justify-center text-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #200512 0%, #0d0208 60%, #050003 100%)'
      }}
    >
      {/* Cinematic Aura */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-rose-600/10 blur-[150px] pointer-events-none animate-romantic-pulse" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      {/* Subtle Floating Ring Icon */}
      <div className="relative mb-10">
        <div className="w-20 h-20 rounded-full border border-rose-400/20 bg-rose-950/30 flex items-center justify-center text-3xl shadow-2xl animate-float-gentle">
          <span>💍</span>
        </div>
      </div>

      {/* Progressive Cinematic Lines */}
      <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10 px-4">
        {activeLines.map((line, idx) => {
          const isRevealed = visibleStep > idx;
          const isFinal = idx === activeLines.length - 1;
          const isMilestone = idx >= 2 && idx <= 5;

          return (
            <div
              key={idx}
              className={`transition-all duration-1000 transform ${
                isRevealed ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 translate-y-6 blur-xs'
              }`}
            >
              {isFinal ? (
                /* The Final Grand Line: My Forever ❤️💍 */
                <div className="pt-6">
                  <h3 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-white text-glow-rose tracking-tight leading-tight">
                    {line}
                  </h3>
                  <div className="mt-4 flex items-center justify-center gap-2 text-rose-400">
                    <Heart className="w-4 h-4 fill-rose-500 animate-pulse" />
                    <span className="text-xs font-sans tracking-[0.3em] uppercase text-rose-300/70">
                      Eternal Promise
                    </span>
                    <Heart className="w-4 h-4 fill-rose-500 animate-pulse" />
                  </div>
                </div>
              ) : isMilestone ? (
                /* The Sacred Progression: Girlfriend, Best Friend, Home, Wife */
                <p className="font-serif italic text-2xl sm:text-4xl md:text-5xl text-rose-200/90 tracking-wide font-light">
                  {line}
                </p>
              ) : (
                /* Opening lines */
                <p className="font-serif text-xl sm:text-3xl md:text-4xl text-rose-100/80 font-light leading-relaxed">
                  {line}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
