import React, { useState } from 'react';
import { Smile, Sparkles, Heart } from 'lucide-react';
import { PhotoItem } from '../types/personalization';
import { LightboxModal } from './LightboxModal';

interface SillyMemoriesProps {
  photos: PhotoItem[];
  title?: string;
  note: string;
}

export const SillyMemories: React.FC<SillyMemoriesProps> = ({ photos, title, note }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  // Focus on photos that have a silly caption or pick alternating photos from the 12
  const sillyPhotos = photos.filter((p) => p.sillyCaption).slice(0, 8);
  const displayPhotos = sillyPhotos.length >= 4 ? sillyPhotos : photos.slice(0, 6);

  const playfulStickers = ['✨ Cutie', '😂 Pure Joy', '🍕 Foodie Mood', '🤪 Goofball', '🥰 Secret Smile', '💖 Stolen Glance'];

  return (
    <section id="silly-memories" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background soft glow */}
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-pink-700/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-950/40 border border-pink-500/25 text-pink-300 text-xs font-sans tracking-widest uppercase">
          <Smile className="w-3.5 h-3.5" />
          <span>The Fun Side of Us</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight text-glow-rose">
          {title ? title : <>Silly Memories <span className="text-pink-400">❤️</span></>}
        </h2>

        <p className="font-sans text-sm sm:text-base text-rose-200/70 font-light leading-relaxed">
          {note ||
            'Because amidst all the quiet romance, it is our uncontrollable laughter, goofy faces, and playful moments that make us truly us.'}
        </p>
      </div>

      {/* Silly Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayPhotos.map((photo, index) => {
          const sticker = playfulStickers[index % playfulStickers.length];
          return (
            <div
              key={`silly-${photo.id}`}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative rounded-2xl p-3 bg-gradient-to-b from-rose-950/40 via-purple-950/20 to-black/60 border border-rose-400/20 backdrop-blur-md hover:border-pink-400/50 transition-all duration-400 cursor-pointer shadow-xl hover:-translate-y-1.5"
            >
              {/* Playful sticker pill */}
              <div className="absolute top-5 left-5 z-20 px-2.5 py-0.5 rounded-full bg-black/75 border border-pink-400/40 text-[11px] font-sans font-medium text-pink-200 backdrop-blur-md shadow-md">
                {sticker}
              </div>

              {/* Photo Area */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/60">
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.sillyCaption || photo.caption || `Silly photo ${photo.id}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-rose-950/30 text-rose-300">
                    <Smile className="w-8 h-8 text-pink-400 mb-2" />
                    <span className="font-serif text-sm">Silly Moment #{photo.id}</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>

              {/* Caption */}
              <div className="p-3 text-center">
                <p className="font-sans text-sm text-pink-100 font-normal leading-snug line-clamp-2 group-hover:text-white transition-colors">
                  {photo.sillyCaption || photo.caption || 'When we couldn’t stop giggling 😂'}
                </p>
                <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-pink-300/60 font-sans">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Tap to expand</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal in Silly Mode */}
      <LightboxModal
        photo={selectedPhoto}
        photos={photos}
        isOpen={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        isSillyMode={true}
      />
    </section>
  );
};
