import React, { useState, useRef } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { romanticAudio } from '../utils/audioUtils';

interface OpeningProposalProps {
  herName: string;
  onAccept: () => void;
}

export const OpeningProposal: React.FC<OpeningProposalProps> = ({ herName, onAccept }) => {
  const [noPosition, setNoPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [playfulMessage, setPlayfulMessage] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [heartsBurst, setHeartsBurst] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const playfulRemarks = [
    'Nice try 😉',
    'Are you sure? Try again! 💕',
    'Error 404: "No" not found! 💖',
    'My heart won\'t let you! 💍',
    'Forever means forever! 🥰',
    'Look at the other button! ❤️'
  ];

  const handleNoInteraction = () => {
    // Generate playful offset within bounds
    const maxOffset = 140;
    const randomX = (Math.random() - 0.5) * (maxOffset * 2);
    const randomY = (Math.random() - 0.5) * (maxOffset * 1.5);
    setNoPosition({ x: randomX, y: randomY });

    const randomMsg = playfulRemarks[Math.floor(Math.random() * playfulRemarks.length)];
    setPlayfulMessage(randomMsg);

    // Audio playful chime
    romanticAudio.playChime([392, 440], 0.4);
  };

  const handleYes = () => {
    setIsAccepting(true);
    romanticAudio.playYesCelebration();

    // Create burst of celebration hearts
    const burst = Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 450,
      y: (Math.random() - 0.5) * 450 - 80,
      size: Math.random() * 22 + 14
    }));
    setHeartsBurst(burst);

    // Trigger transition after brief emotional cinematic burst
    setTimeout(() => {
      onAccept();
    }, 1100);
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center transition-all duration-1000 ${
        isAccepting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #1b0510 0%, #0d0208 60%, #050003 100%)'
      }}
    >
      {/* Soft ambient background glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-rose-600/10 blur-[120px] pointer-events-none animate-romantic-pulse" />
      <div className="absolute w-[360px] h-[360px] rounded-full bg-fuchsia-600/10 blur-[100px] pointer-events-none" />

      {/* Floating Ring & Heart Emblem */}
      <div className="relative mb-8 group">
        <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/20 via-pink-500/30 to-amber-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700" />
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-rose-300/25 bg-rose-950/40 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-rose-950/80">
          <div className="relative flex items-center justify-center">
            {/* Elegant Ring silhouette */}
            <span className="text-4xl sm:text-5xl select-none animate-float-gentle drop-shadow-[0_0_15px_rgba(251,113,133,0.6)]">
              💍
            </span>
            <Heart className="absolute -top-1 -right-1 w-6 h-6 text-rose-400 fill-rose-500/60 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Recipient subtle greeting */}
      {herName && (
        <p className="font-script text-2xl sm:text-3xl text-rose-300/80 mb-3 tracking-wide select-none">
          For my beloved {herName}
        </p>
      )}

      {/* Main Proposal Question */}
      <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-rose-50 tracking-tight max-w-2xl leading-tight mb-6 text-glow-rose px-4">
        Will you stay with me forever? <span className="inline-block whitespace-nowrap">❤️💍</span>
      </h1>

      <p className="text-xs sm:text-sm text-rose-200/60 max-w-md font-sans tracking-widest uppercase mb-12">
        A private digital love story crafted just for you
      </p>

      {/* Interactive Buttons */}
      <div className="relative flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 min-h-[140px] w-full max-w-md">
        {/* YES BUTTON */}
        <button
          onClick={handleYes}
          disabled={isAccepting}
          className="relative group px-10 py-4 sm:px-12 sm:py-4.5 rounded-full font-serif text-xl sm:text-2xl text-white tracking-wider transition-all duration-500 shadow-2xl cursor-pointer overflow-hidden border border-rose-400/40"
          style={{
            background: 'linear-gradient(135deg, #a21caf 0%, #be123c 50%, #881337 100%)',
            boxShadow: '0 0 35px rgba(225, 29, 72, 0.45), 0 10px 25px rgba(0, 0, 0, 0.6)'
          }}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative flex items-center gap-3 font-medium">
            <span>YES</span>
            <Heart className="w-5 h-5 text-rose-200 fill-rose-200 group-hover:scale-125 transition-transform duration-300" />
          </span>
        </button>

        {/* NO BUTTON (Playful) */}
        <div
          style={{
            transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
            transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          className="relative inline-block"
        >
          <button
            onMouseEnter={handleNoInteraction}
            onClick={handleNoInteraction}
            onTouchStart={handleNoInteraction}
            className="px-8 py-3.5 sm:px-9 sm:py-4 rounded-full font-serif text-lg sm:text-xl text-rose-300/60 hover:text-rose-200 border border-rose-900/40 bg-black/40 backdrop-blur-sm transition-colors cursor-pointer select-none"
          >
            NO
          </button>

          {/* Playful toast message */}
          {playfulMessage && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-500/30 text-[11px] text-rose-200 font-sans whitespace-nowrap shadow-lg animate-bounce pointer-events-none">
              {playfulMessage}
            </div>
          )}
        </div>
      </div>

      {/* Bursting hearts effect when accepted */}
      {isAccepting && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          {heartsBurst.map((h) => (
            <div
              key={h.id}
              className="absolute text-rose-400 select-none animate-ping"
              style={{
                transform: `translate(${h.x}px, ${h.y}px)`,
                fontSize: `${h.size}px`,
                animationDuration: '1.2s'
              }}
            >
              ❤️
            </div>
          ))}
          <div className="text-3xl text-rose-100 font-serif animate-pulse flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-300 animate-spin" />
            <span>Forever begins now...</span>
          </div>
        </div>
      )}
    </div>
  );
};
