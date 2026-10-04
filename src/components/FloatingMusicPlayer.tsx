import React, { useState } from 'react';
import { Music, Play, Pause, ExternalLink, ChevronUp, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { romanticAudio } from '../utils/audioUtils';

interface FloatingMusicPlayerProps {
  songTitle: string;
  songArtist: string;
  spotifyUrl: string;
  spotifyTrackId: string;
}

export const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({
  songTitle = 'Pondattee',
  songArtist = 'D. Imman',
  spotifyUrl,
  spotifyTrackId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  const toggleAmbient = () => {
    if (isAmbientPlaying) {
      romanticAudio.stopAmbientLoop();
      setIsAmbientPlaying(false);
    } else {
      romanticAudio.startAmbientLoop();
      setIsAmbientPlaying(true);
    }
  };

  return (
    <aside aria-label="Music Soundtrack Controls" className="fixed bottom-4 right-4 z-40 max-w-[calc(100vw-2rem)] sm:max-w-md">
      {/* Expanded Spotify Drawer */}
      {isExpanded && (
        <div className="mb-2 p-3 rounded-2xl bg-black/90 border border-rose-500/30 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-rose-500/20 text-xs text-rose-200">
            <span className="font-serif italic font-medium flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-rose-400" />
              <span>Full Track: {songTitle}</span>
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-rose-400 hover:text-white p-1"
              aria-label="Minimize player"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <iframe
            title="Floating Spotify Player"
            src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
          />

          <div className="mt-2 flex items-center justify-between text-[11px] text-rose-300/70">
            <button
              onClick={toggleAmbient}
              className="inline-flex items-center gap-1 text-rose-300 hover:text-rose-100"
            >
              {isAmbientPlaying ? <Volume2 className="w-3 h-3 text-pink-400" /> : <VolumeX className="w-3 h-3" />}
              <span>{isAmbientPlaying ? 'Chimes On' : 'Chimes Off'}</span>
            </button>

            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#1DB954] hover:underline"
            >
              <span>App</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Compact Floating Bar */}
      <div className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full bg-black/80 border border-rose-400/30 backdrop-blur-md shadow-2xl">
        {/* Equalizer animation icon */}
        <div className="flex items-end gap-0.5 h-3.5 w-3.5 px-0.5">
          <span className="w-1 bg-rose-400 rounded-full animate-bounce h-3" />
          <span className="w-1 bg-pink-400 rounded-full animate-bounce h-2 delay-100" />
          <span className="w-1 bg-rose-500 rounded-full animate-bounce h-3.5 delay-200" />
        </div>

        {/* Track Label */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-left cursor-pointer flex flex-col justify-center max-w-[130px] sm:max-w-[170px]"
        >
          <span className="font-serif text-xs sm:text-sm text-white font-medium truncate">
            {songTitle}
          </span>
          <span className="font-sans text-[10px] text-rose-300/60 truncate">
            Our Song • Tap to play
          </span>
        </button>

        {/* Expand / Minimize toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-full bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-400/20 transition-all cursor-pointer"
          aria-label={isExpanded ? 'Minimize player' : 'Expand player'}
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {/* Direct Spotify open */}
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black transition-all shadow-md"
          title="Open track directly in Spotify"
          aria-label="Open track in Spotify"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
};
