import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';
import { PhotoItem } from '../types/personalization';

interface LightboxModalProps {
  photo: PhotoItem | null;
  photos: PhotoItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photo: PhotoItem) => void;
  isSillyMode?: boolean;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  photos,
  isOpen,
  onClose,
  onSelectPhoto,
  isSillyMode = false,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, photo, photos]);

  if (!isOpen || !photo) return null;

  const currentIndex = photos.findIndex((p) => p.id === photo.id);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % photos.length;
    onSelectPhoto(photos[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
    onSelectPhoto(photos[prevIdx]);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-500/30 transition-all cursor-pointer shadow-lg"
        aria-label="Close photo lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-2 sm:left-6 z-40 p-3 rounded-full bg-black/50 hover:bg-rose-950/80 text-rose-200 border border-rose-400/20 transition-all cursor-pointer"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Next button */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-2 sm:right-6 z-40 p-3 rounded-full bg-black/50 hover:bg-rose-950/80 text-rose-200 border border-rose-400/20 transition-all cursor-pointer"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Main Lightbox Content */}
      <div
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative group max-w-full flex flex-col items-center">
          {photo.url ? (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-rose-400/25 bg-neutral-950 max-h-[72vh] flex items-center justify-center">
              <img
                src={photo.url}
                alt={photo.caption || `Personal photo ${photo.id}`}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-2xl select-none"
              />
            </div>
          ) : (
            <div className="w-[320px] sm:w-[480px] h-[340px] sm:h-[420px] rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/50 to-black/80 flex flex-col items-center justify-center p-6 text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full border border-rose-400/30 flex items-center justify-center mb-4 text-rose-300">
                <Heart className="w-8 h-8 fill-rose-500/20" />
              </div>
              <p className="font-serif text-xl text-rose-100 mb-2">Personal Photo #{photo.id}</p>
              <p className="text-xs text-rose-200/60 font-sans max-w-xs">
                Upload your photo in the Personalization Panel to illuminate this memory frame.
              </p>
            </div>
          )}

          {/* Caption bar */}
          <div className="mt-4 px-6 py-3 rounded-xl bg-black/70 border border-rose-400/15 backdrop-blur-md max-w-2xl text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[11px] font-sans tracking-widest uppercase text-rose-300/70">
                Memory {currentIndex + 1} of {photos.length}
              </span>
              {isSillyMode && (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-300/90 font-medium">
                  <Sparkles className="w-3 h-3" /> Silly Edition
                </span>
              )}
            </div>

            <p className="font-serif italic text-base sm:text-xl text-rose-50 leading-relaxed">
              {isSillyMode && photo.sillyCaption
                ? photo.sillyCaption
                : photo.caption || 'A timeless memory with you ❤️'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
