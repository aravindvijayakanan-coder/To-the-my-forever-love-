import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  herName: string;
  myName: string;
  birthdayDate: string;
}

export const Footer: React.FC<FooterProps> = ({
  herName,
  myName,
  birthdayDate,
}) => {
  return (
    <footer className="relative py-12 px-4 sm:px-6 border-t border-rose-500/10 text-center font-sans text-xs text-rose-300/60">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4">
        {/* Heart line */}
        <div className="flex items-center justify-center gap-2 text-rose-400/50">
          <span className="h-px w-8 bg-rose-500/20" />
          <Heart className="w-3.5 h-3.5 fill-rose-500/30" />
          <span className="h-px w-8 bg-rose-500/20" />
        </div>

        <p className="font-serif italic text-base text-rose-100/90 tracking-wide">
          Forever & Always with you, {herName} {myName ? `— with all my love, ${myName}` : ''}
        </p>

        {birthdayDate && (
          <p className="text-[11px] text-rose-300/50 font-sans tracking-widest uppercase">
            Celebrating {birthdayDate}
          </p>
        )}

        <div className="pt-2 text-[11px] text-rose-400/40">
          <span>Crafted with infinite devotion</span>
        </div>
      </div>
    </footer>
  );
};
