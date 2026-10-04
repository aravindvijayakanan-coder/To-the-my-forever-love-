import React from 'react';
import { Music, Heart, ExternalLink, Sparkles } from 'lucide-react';

interface OurSongSectionProps {
  songTitle: string;
  songArtist: string;
  spotifyUrl: string;
  spotifyTrackId: string;
}

export const OurSongSection: React.FC<OurSongSectionProps> = ({
  songTitle = 'Pondattee',
  songArtist = 'D. Imman',
  spotifyUrl = 'https://open.spotify.com/track/28zGTndSQj4JT9nCPHRoTV',
  spotifyTrackId = '28zGTndSQj4JT9nCPHRoTV',
}) => {
  const embedUrl = `https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0`;

  return (
    <section id="our-song" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] bg-rose-800/12 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 text-rose-300/80 text-xs font-sans tracking-[0.25em] uppercase">
          <Music className="w-3.5 h-3.5 text-rose-400" />
          <span>The Soundtrack of Us</span>
          <Music className="w-3.5 h-3.5 text-rose-400" />
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight text-glow-rose">
          Our Song <span className="text-rose-400">❤️🎵</span>
        </h2>

        <p className="font-sans text-sm sm:text-base text-rose-200/60 font-light leading-relaxed">
          The one melody that belongs solely to our story. Every note echoes the love, devotion, and gratitude I hold in my heart for you.
        </p>
      </div>

      {/* Main Music Showcase Card */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-rose-400/25 bg-gradient-to-br from-rose-950/50 via-purple-950/30 to-black/80 backdrop-blur-xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Song info column */}
          <div className="md:col-span-5 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-900/40 border border-rose-400/30 text-rose-200 text-xs font-sans">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Official Track</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl text-white font-medium text-glow-rose">
              {songTitle}
            </h3>

            {songArtist && (
              <p className="font-sans text-sm sm:text-base text-rose-200/80 font-light">
                {songArtist}
              </p>
            )}

            <p className="font-sans text-xs sm:text-sm text-rose-300/60 leading-relaxed font-light pt-2">
              "Pondattee" represents the eternal bond between us. Stream the full song directly through the official Spotify player below or launch your Spotify app.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1aa34a] text-black font-sans text-xs font-semibold tracking-wide transition-all shadow-lg hover:scale-105"
              >
                <span>Open in Spotify ❤️</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Spotify Official Player Embed column */}
          <div className="md:col-span-7">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-rose-400/20 bg-black/80">
              <iframe
                title={`Spotify Player - ${songTitle}`}
                src={embedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-2xl"
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-rose-300/50 font-sans px-2">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> Full track supported via Spotify
              </span>
              <span>Plays continuously as you browse</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
