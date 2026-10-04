import React, { useState } from 'react';
import { Heart, Music, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOurSongClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOurSongClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Gallery', href: '#gallery' },
    { label: 'Silly Memories', href: '#silly-memories' },
    { label: 'Reasons', href: '#things-i-love' },
    { label: 'Love Letter', href: '#love-letter' },
    { label: 'Our Song', href: '#our-song' },
    { label: 'Forever', href: '#forever' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080206]/85 backdrop-blur-md border-b border-rose-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="font-serif text-lg sm:text-xl font-light tracking-wide text-rose-100 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <span>Forever & Always</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/50" />
        </a>

        {/* Zone 2: Clean text navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-sans uppercase tracking-[0.2em] text-rose-200/70">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-rose-100 hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOurSongClick}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans font-medium text-rose-100 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/30 transition-all cursor-pointer whitespace-nowrap"
          >
            <Music className="w-3.5 h-3.5 text-rose-400" />
            <span>Pondattee</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-rose-200 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e030a]/95 border-b border-rose-500/20 px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3 font-sans text-xs uppercase tracking-widest text-rose-200/80">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={handleLinkClick}
                className="py-1.5 hover:text-rose-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-rose-500/10 flex items-center justify-between">
            <button
              onClick={() => {
                onOurSongClick();
                setMobileMenuOpen(false);
              }}
              className="inline-flex items-center gap-2 text-xs text-rose-300 font-sans"
            >
              <Music className="w-3.5 h-3.5" />
              <span>Our Song: Pondattee</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
