import React, { useState } from 'react';
import { Sparkles, Heart, Eye, Grid, Film } from 'lucide-react';
import { PhotoItem } from '../types/personalization';
import { LightboxModal } from './LightboxModal';

interface PhotoWorldProps {
  photos: PhotoItem[];
}

export const PhotoWorld: React.FC<PhotoWorldProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [activeTab, setActiveTab] = useState<'cinematic' | 'polaroid'>('cinematic');

  // Pre-calculated organic rotations for Polaroid realism
  const polaroidRotations = [
    '-rotate-2',
    'rotate-2',
    '-rotate-1',
    'rotate-3',
    '-rotate-3',
    'rotate-1',
    '-rotate-2',
    'rotate-2',
    '-rotate-1',
    'rotate-3',
    '-rotate-2',
    'rotate-1'
  ];

  return (
    <section id="gallery" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 text-rose-300/80 text-xs font-sans tracking-[0.25em] uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Moments In Time</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight text-glow-rose">
          Our Personal Photo World
        </h2>

        <p className="font-sans text-sm sm:text-base text-rose-200/60 font-light leading-relaxed">
          Twelve captured whispers of our journey. Each frame holds a heartbeat, a smile, and a reminder of why you are my whole world.
        </p>

        {/* View Layout Toggle (Segmented control) */}
        <div className="pt-4 flex items-center justify-center">
          <div className="inline-flex p-1 rounded-full bg-rose-950/40 border border-rose-400/20 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('cinematic')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'cinematic'
                  ? 'bg-gradient-to-r from-rose-700 to-pink-800 text-white shadow-lg'
                  : 'text-rose-200/60 hover:text-rose-100'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Cinematic Gallery</span>
            </button>
            <button
              onClick={() => setActiveTab('polaroid')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'polaroid'
                  ? 'bg-gradient-to-r from-rose-700 to-pink-800 text-white shadow-lg'
                  : 'text-rose-200/60 hover:text-rose-100'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Polaroid Wall</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: CINEMATIC SHOWCASE GRID */}
      {activeTab === 'cinematic' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative rounded-2xl overflow-hidden glass-romantic-card glass-romantic-hover cursor-pointer transition-all duration-500"
            >
              {/* Photo Container */}
              <div className="relative aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-black/60 flex items-center justify-center">
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.caption || `Photo ${photo.id}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-rose-950/40 to-black/80">
                    <div className="w-14 h-14 rounded-full border border-rose-500/30 flex items-center justify-center text-rose-300 mb-3 group-hover:border-rose-400 group-hover:scale-110 transition-all">
                      <Heart className="w-6 h-6 fill-rose-500/20" />
                    </div>
                    <span className="font-serif text-lg text-rose-100 font-medium">
                      Memory #{photo.id}
                    </span>
                    <span className="text-[11px] text-rose-300/50 uppercase tracking-widest mt-1">
                      Upload in Personalization
                    </span>
                  </div>
                )}

                {/* Subtle gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Tap to expand hover icon */}
                <div className="absolute top-3 right-3 p-2 rounded-full bg-black/40 border border-white/10 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                  <Eye className="w-4 h-4" />
                </div>

                {/* Photo number index indicator */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/40 border border-rose-400/20 text-[10px] tracking-widest uppercase font-mono text-rose-200 backdrop-blur-sm">
                  0{photo.id}
                </div>
              </div>

              {/* Caption Footer */}
              <div className="p-4 sm:p-5">
                <p className="font-serif italic text-sm sm:text-base text-rose-100/90 leading-snug line-clamp-2 group-hover:text-rose-50 transition-colors">
                  "{photo.caption || 'A moment etched into eternity'}"
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-rose-300/50 font-sans">
                  <span>Click to view full photo</span>
                  <Heart className="w-3.5 h-3.5 text-rose-500/50 group-hover:text-rose-400 group-hover:scale-125 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: POLAROID MEMORY WALL */}
      {activeTab === 'polaroid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-4">
          {photos.map((photo, index) => {
            const rotationClass = polaroidRotations[index % polaroidRotations.length];
            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className={`group relative bg-[#f7f2ea] text-neutral-900 p-4 pb-6 rounded-md shadow-2xl transition-all duration-400 cursor-pointer hover:rotate-0 hover:scale-105 hover:z-30 ${rotationClass}`}
                style={{
                  boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.65), 0 0 20px rgba(190, 18, 60, 0.15)'
                }}
              >
                {/* Vintage Tape Accent on top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/40 border border-white/20 backdrop-blur-[2px] rounded-xs shadow-sm transform -rotate-1 pointer-events-none" />

                {/* Photo Canvas */}
                <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden rounded-xs border border-black/10">
                  {photo.url ? (
                    <img
                      src={photo.url}
                      alt={photo.caption || `Memory ${photo.id}`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-neutral-800 text-rose-200">
                      <Heart className="w-6 h-6 text-rose-400 mb-2" />
                      <span className="font-serif text-sm">Polaroid #{photo.id}</span>
                      <span className="text-[10px] text-neutral-400 mt-1">Ready for photo</span>
                    </div>
                  )}
                </div>

                {/* Handwritten Polaroid Caption */}
                <div className="pt-3 text-center px-1">
                  <p className="font-script text-xl sm:text-2xl text-neutral-800 leading-tight">
                    {photo.caption || `Forever with you #${photo.id}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        photo={selectedPhoto}
        photos={photos}
        isOpen={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
      />
    </section>
  );
};
