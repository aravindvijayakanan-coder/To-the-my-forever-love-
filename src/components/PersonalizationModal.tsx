import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Save,
  Eye,
  RotateCcw,
  Sparkles,
  Heart,
  Music,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  User,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  AlertTriangle
} from 'lucide-react';
import { PersonalizationData, PhotoItem, LovePoint } from '../types/personalization';
import { processImageFile, uploadPhotoToServer } from '../utils/imageUtils';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PersonalizationData;
  onSave: (newData: PersonalizationData) => Promise<boolean>;
  onReset: () => void;
}

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<PersonalizationData>(() => JSON.parse(JSON.stringify(data)));
  const [initialData, setInitialData] = useState<PersonalizationData>(() => JSON.parse(JSON.stringify(data)));
  const [activeTab, setActiveTab] = useState<'basics' | 'photos' | 'silly' | 'love' | 'letter' | 'forever' | 'birthday' | 'song'>('photos');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [letterRawText, setLetterRawText] = useState<string>('');
  const batchFileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state whenever opened
  useEffect(() => {
    if (isOpen) {
      const copy = JSON.parse(JSON.stringify(data));
      setFormData(copy);
      setInitialData(copy);
      setLetterRawText(copy.letterParagraphs ? copy.letterParagraphs.join('\n\n') : '');
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  // Single photo upload handler
  const handlePhotoUpload = async (slotId: number, file: File) => {
    try {
      setUploadingSlot(slotId);
      const optimizedBase64 = await processImageFile(file);
      const permanentUrl = await uploadPhotoToServer(optimizedBase64, slotId);

      setFormData((prev) => ({
        ...prev,
        photos: prev.photos.map((p) =>
          p.id === slotId ? { ...p, url: permanentUrl } : p
        ),
      }));
    } catch (err) {
      console.error('Failed to upload image', err);
      alert('Failed to process image. Please try again.');
    } finally {
      setUploadingSlot(null);
    }
  };

  // Remove photo from slot
  const handleRemovePhoto = (slotId: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.map((p) =>
        p.id === slotId ? { ...p, url: '' } : p
      ),
    }));
  };

  // Batch upload 12 photos at once
  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsSaving(true);
    try {
      const updatedPhotos = [...formData.photos];
      for (let i = 0; i < Math.min(files.length, 12); i++) {
        const file = files[i];
        setUploadingSlot(i + 1);
        const base64 = await processImageFile(file);
        const permanentUrl = await uploadPhotoToServer(base64, i + 1);
        if (updatedPhotos[i]) {
          updatedPhotos[i].url = permanentUrl;
        }
      }
      setFormData((prev) => ({ ...prev, photos: updatedPhotos }));
    } catch (err) {
      console.error('Error during batch upload', err);
      alert('Encountered an issue during batch upload. Individual uploads are also available.');
    } finally {
      setIsSaving(false);
      setUploadingSlot(null);
    }
  };

  // Move a reason item up
  const handleMoveLovePointUp = (index: number) => {
    if (index === 0) return;
    const newPoints = [...formData.lovePoints];
    const temp = newPoints[index - 1];
    newPoints[index - 1] = newPoints[index];
    newPoints[index] = temp;
    setFormData({ ...formData, lovePoints: newPoints });
  };

  // Move a reason item down
  const handleMoveLovePointDown = (index: number) => {
    if (index === formData.lovePoints.length - 1) return;
    const newPoints = [...formData.lovePoints];
    const temp = newPoints[index + 1];
    newPoints[index + 1] = newPoints[index];
    newPoints[index] = temp;
    setFormData({ ...formData, lovePoints: newPoints });
  };

  // Save changes to backend and localStorage
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Parse letter paragraphs from the large text editor
    const paragraphs = letterRawText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const payload: PersonalizationData = {
      ...formData,
      letterParagraphs: paragraphs.length > 0 ? paragraphs : formData.letterParagraphs,
    };

    const success = await onSave(payload);
    setIsSaving(false);
    if (success) {
      setInitialData(JSON.parse(JSON.stringify(payload)));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Reset / Undo changes back to before current editing session
  const handleUndo = () => {
    if (confirm('Revert all unsaved changes in this session?')) {
      setFormData(JSON.parse(JSON.stringify(initialData)));
      setLetterRawText(initialData.letterParagraphs.join('\n\n'));
    }
  };

  // Preview button: saves latest state to current runtime and closes panel so owner sees full recipient view
  const handlePreview = () => {
    // Parse letter paragraphs from the large text editor
    const paragraphs = letterRawText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const currentPayload: PersonalizationData = {
      ...formData,
      letterParagraphs: paragraphs.length > 0 ? paragraphs : formData.letterParagraphs,
    };

    onSave(currentPayload);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl h-[94vh] max-h-[880px] bg-[#10030a] border border-rose-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-rose-500/20 bg-rose-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-900/60 border border-rose-400/30 flex items-center justify-center text-rose-300">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-2xl text-white font-medium">
                Personalization & Owner Panel
              </h2>
              <p className="text-[11px] sm:text-xs text-rose-300/60 font-sans">
                Customize your birthday gift. All changes persist permanently after saving.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors cursor-pointer"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 py-2 border-b border-rose-500/15 bg-black/40 flex items-center gap-1.5 overflow-x-auto text-xs font-sans scrollbar-none">
          {[
            { id: 'photos', label: '12 Photos & Captions', icon: ImageIcon },
            { id: 'basics', label: 'Names & Birthday Date', icon: User },
            { id: 'silly', label: 'Silly Memories', icon: Sparkles },
            { id: 'love', label: 'Things I Love & Eyes', icon: Heart },
            { id: 'letter', label: 'Love Letter', icon: FileText },
            { id: 'forever', label: 'Final Forever Message', icon: Heart },
            { id: 'birthday', label: 'Birthday Message', icon: Sparkles },
            { id: 'song', label: 'Our Song (Pondattee)', icon: Music },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-800 text-white shadow-md font-medium'
                    : 'text-rose-300/60 hover:text-rose-100 hover:bg-rose-950/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: ALL 12 PHOTOS & CAPTIONS */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              {/* Batch Upload Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-950/30 border border-rose-400/20">
                <div>
                  <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                    <span>12 Personal Photos & Captions</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-200 border border-rose-500/20 font-sans">
                      Slots 1 to 12
                    </span>
                  </h3>
                  <p className="text-xs text-rose-200/70 max-w-xl mt-1">
                    Upload your exact 12 personal photos. For every photo, you can replace the image, view the live preview, and customize its caption text.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={batchFileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleBatchUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => batchFileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-700 to-pink-700 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-medium flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Batch Upload (All 12 Photos)</span>
                  </button>
                </div>
              </div>

              {/* 12 Dedicated Photo Slots */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formData.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="p-4 rounded-2xl bg-black/50 border border-rose-500/20 space-y-3 relative flex flex-col justify-between"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs text-rose-200 font-sans">
                      <span className="font-semibold text-rose-100 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
                        <span>PHOTO {photo.id}</span>
                      </span>
                      {uploadingSlot === photo.id && (
                        <span className="text-amber-300 text-[11px] animate-pulse">
                          Uploading...
                        </span>
                      )}
                    </div>

                    {/* [Photo Preview] & [Upload Photo] */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 border border-rose-500/20 flex items-center justify-center group">
                      {photo.url ? (
                        <img
                          src={photo.url}
                          alt={`Photo ${photo.id}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-3 text-rose-300/50">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1 text-rose-400/30" />
                          <p className="text-[11px]">No photo uploaded</p>
                        </div>
                      )}

                      {/* Hover overlay with Upload & Remove */}
                      <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        <label className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-md">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{photo.url ? 'Replace Image' : 'Upload Image'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePhotoUpload(photo.id, file);
                            }}
                          />
                        </label>
                        {photo.url && (
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="px-3 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/30 text-red-200 text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Separate Upload / Replace Button directly accessible */}
                    <div className="flex items-center gap-2">
                      <label className="flex-1 py-1.5 px-3 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/25 text-rose-200 text-xs text-center font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-rose-400" />
                        <span>{photo.url ? 'Change Photo' : 'Upload Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(photo.id, file);
                          }}
                        />
                      </label>
                      {photo.url && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-950 border border-rose-500/20 text-rose-400 hover:text-red-400 transition-colors"
                          title="Clear photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* [Caption Text] directly below upload control */}
                    <div className="space-y-2 pt-1">
                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-rose-300/80 mb-1">
                          Caption Text
                        </label>
                        <input
                          type="text"
                          value={photo.caption}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              photos: prev.photos.map((p) =>
                                p.id === photo.id ? { ...p, caption: val } : p
                              ),
                            }));
                          }}
                          placeholder="E.g. In your arms, I found my forever home"
                          className="w-full px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/25 text-xs text-white placeholder-rose-400/30 focus:outline-hidden focus:border-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-pink-300/80 mb-1">
                          Silly Memory Caption
                        </label>
                        <input
                          type="text"
                          value={photo.sillyCaption || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              photos: prev.photos.map((p) =>
                                p.id === photo.id ? { ...p, sillyCaption: val } : p
                              ),
                            }));
                          }}
                          placeholder="E.g. That goofy laugh when you saw the dessert 😂"
                          className="w-full px-3 py-1.5 rounded-lg bg-pink-950/30 border border-pink-500/25 text-xs text-white placeholder-pink-400/30 focus:outline-hidden focus:border-pink-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: BASICS (HER NAME, GIVER NAME, BIRTHDAY DATE) */}
          {activeTab === 'basics' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-400/20 text-xs text-rose-200 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>
                  <strong>Names & Birthday Date:</strong> These fields update the names and birthday date everywhere across the website in real-time.
                </span>
              </div>

              {/* 1. HER NAME */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-rose-300/80 mb-1.5 font-medium">
                  1. Her Name (Recipient)
                </label>
                <input
                  type="text"
                  value={formData.herName}
                  onChange={(e) => setFormData({ ...formData, herName: e.target.value })}
                  placeholder="E.g. My Dearest Wife / Her Full Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-hidden focus:border-rose-400"
                />
                <p className="text-[11px] text-rose-300/50 mt-1">
                  Updates her name on the opening question, birthday reveal, love letter, and headers.
                </p>
              </div>

              {/* 2. MY NAME / GIVER NAME */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-rose-300/80 mb-1.5 font-medium">
                  2. My Name / Giver Name
                </label>
                <input
                  type="text"
                  value={formData.myName}
                  onChange={(e) => setFormData({ ...formData, myName: e.target.value })}
                  placeholder="E.g. Aravind / Your Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-hidden focus:border-rose-400"
                />
                <p className="text-[11px] text-rose-300/50 mt-1">
                  This is the name of the person giving the birthday gift. Updates signatures, letter sign-off, and footer.
                </p>
              </div>

              {/* 3. BIRTHDAY DATE */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-rose-300/80 mb-1.5 font-medium">
                  3. Birthday Date (ONLY date on the website)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.birthdayDate}
                      onChange={(e) => setFormData({ ...formData, birthdayDate: e.target.value })}
                      placeholder="E.g. October 14th"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-hidden focus:border-rose-400"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-2.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-1.5 cursor-pointer hover:bg-rose-900/60">
                      <Calendar className="w-4 h-4 text-rose-400" />
                      <span>Pick Date</span>
                      <input
                        type="date"
                        className="hidden"
                        onChange={(e) => {
                          const dateVal = e.target.value;
                          if (dateVal) {
                            const [year, month, day] = dateVal.split('-');
                            const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            const formatted = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
                            // Add ordinal suffix (1st, 2nd, 3rd, 4th)
                            const dayNum = parseInt(day, 10);
                            let suffix = 'th';
                            if (dayNum % 10 === 1 && dayNum !== 11) suffix = 'st';
                            else if (dayNum % 10 === 2 && dayNum !== 12) suffix = 'nd';
                            else if (dayNum % 10 === 3 && dayNum !== 13) suffix = 'rd';
                            setFormData({ ...formData, birthdayDate: `${formatted}${suffix}` });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <p className="text-[11px] text-rose-300/50 mt-1">
                  Shown exclusively in the Birthday Reveal. No fake timeline or relationship dates will ever appear.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: SILLY MEMORIES TEXT */}
          {activeTab === 'silly' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-rose-300/80 mb-1.5 font-medium">
                  Section Title
                </label>
                <input
                  type="text"
                  value={formData.sillyMemoriesTitle || 'Silly Memories ❤️'}
                  onChange={(e) => setFormData({ ...formData, sillyMemoriesTitle: e.target.value })}
                  placeholder="Silly Memories ❤️"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-hidden focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-rose-300/80 mb-1.5 font-medium">
                  Section Subtitle / Intro Note
                </label>
                <textarea
                  rows={4}
                  value={formData.sillyMemoriesNote}
                  onChange={(e) => setFormData({ ...formData, sillyMemoriesNote: e.target.value })}
                  placeholder="Because amidst all the quiet romance, it is our uncontrollable laughter, silly faces, and playful moments that make us truly us."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-hidden focus:border-rose-400"
                />
                <p className="text-[11px] text-rose-300/50 mt-1">
                  Individual silly memory captions can be adjusted for each photo in the "12 Photos & Captions" tab.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: THINGS I LOVE ABOUT YOU & EYES */}
          {activeTab === 'love' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Special Eyes Quote Feature */}
              <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-400/30 space-y-3">
                <div className="flex items-center gap-2 text-rose-200 font-serif text-lg">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Romantic Centerpiece: Her Eyes</span>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-rose-300/80 mb-1">
                    Special Eyes Quote (Displayed in Arched Glass Card)
                  </label>
                  <input
                    type="text"
                    value={formData.eyesQuote}
                    onChange={(e) => setFormData({ ...formData, eyesQuote: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-rose-300/80 mb-1">
                    Personal Note on Her Eyes
                  </label>
                  <input
                    type="text"
                    value={formData.eyesNote}
                    onChange={(e) => setFormData({ ...formData, eyesNote: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm focus:outline-hidden"
                  />
                </div>

                <div className="pt-3 border-t border-rose-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-rose-200 font-serif text-base">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <span>Romantic Feature: Her Cheeks & Smile</span>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-rose-300/80 mb-1">
                      Cheeks & Smile Quote
                    </label>
                    <input
                      type="text"
                      value={formData.cheeksQuote || ''}
                      onChange={(e) => setFormData({ ...formData, cheeksQuote: e.target.value })}
                      placeholder="Your laughter and the gentle blush upon your cheeks make my entire world light up. ❤️"
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-rose-300/80 mb-1">
                      Personal Note on Her Cheeks & Smile
                    </label>
                    <input
                      type="text"
                      value={formData.cheeksNote || ''}
                      onChange={(e) => setFormData({ ...formData, cheeksNote: e.target.value })}
                      placeholder="Every smile that touches your cheeks is a reminder of how blessed I am."
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Love Points List with Reordering */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg text-white">
                      Reasons I Love You ({formData.lovePoints.length})
                    </h3>
                    <p className="text-xs text-rose-300/60 font-sans">
                      Add, edit, delete, or use the up/down arrows to reorder.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newPoint: LovePoint = {
                        id: `lp-${Date.now()}`,
                        title: 'New Reason',
                        description: 'Write why this fills your heart with love...',
                      };
                      setFormData({ ...formData, lovePoints: [...formData.lovePoints, newPoint] });
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-100 text-xs flex items-center gap-1.5 cursor-pointer border border-rose-400/25"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Reason</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.lovePoints.map((point, idx) => (
                    <div
                      key={point.id || idx}
                      className="p-4 rounded-xl bg-black/40 border border-rose-500/20 flex gap-3 items-start group"
                    >
                      {/* Reorder Arrows */}
                      <div className="flex flex-col gap-1 pt-1 text-rose-400/60">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveLovePointUp(idx)}
                          className="p-1 rounded hover:bg-rose-950 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === formData.lovePoints.length - 1}
                          onClick={() => handleMoveLovePointDown(idx)}
                          className="p-1 rounded hover:bg-rose-950 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif text-rose-400 font-medium">0{idx + 1}.</span>
                          <input
                            type="text"
                            value={point.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                lovePoints: prev.lovePoints.map((p, i) =>
                                  i === idx ? { ...p, title: val } : p
                                ),
                              }));
                            }}
                            className="flex-1 font-serif text-base text-white bg-transparent border-b border-rose-500/30 focus:outline-hidden pb-1"
                            placeholder="Reason Title"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={point.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              lovePoints: prev.lovePoints.map((p, i) =>
                                i === idx ? { ...p, description: val } : p
                              ),
                            }));
                          }}
                          className="w-full text-xs text-rose-200/80 bg-transparent border border-rose-500/20 rounded-lg p-2 focus:outline-hidden"
                          placeholder="Reason Description..."
                        />
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          setFormData({
                            ...formData,
                            lovePoints: formData.lovePoints.filter((_, i) => i !== idx),
                          });
                        }}
                        className="text-rose-500/60 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                        title="Delete reason"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LOVE LETTER (LARGE TEXT EDITOR) */}
          {activeTab === 'letter' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-400/20 text-xs text-rose-200 leading-relaxed">
                <strong>Interactive Love Letter:</strong> Write your personalized letter below. When she taps the wax seal on the envelope, this exact letter will unfold.
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-rose-300/80 mb-1.5 font-medium">
                  Salutation
                </label>
                <input
                  type="text"
                  value={formData.letterSalutation}
                  onChange={(e) => setFormData({ ...formData, letterSalutation: e.target.value })}
                  placeholder="My Dearest Love,"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs uppercase tracking-wider text-rose-300/80 font-medium">
                    Complete Love Letter (Large Text Editor)
                  </label>
                  <span className="text-[11px] text-rose-300/50">
                    Separate paragraphs with a blank line
                  </span>
                </div>
                <textarea
                  rows={12}
                  value={letterRawText}
                  onChange={(e) => setLetterRawText(e.target.value)}
                  placeholder="Write your personal love letter here... Separate paragraphs with a blank line."
                  className="w-full p-4 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm leading-relaxed font-serif focus:outline-hidden focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-rose-300/80 mb-1.5 font-medium">
                  Sign-off
                </label>
                <input
                  type="text"
                  value={formData.letterSignoff}
                  onChange={(e) => setFormData({ ...formData, letterSignoff: e.target.value })}
                  placeholder="Forever & unconditionally yours,"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-hidden"
                />
              </div>

              <div className="p-3 rounded-lg bg-black/30 border border-rose-500/20 text-xs text-rose-300/70 flex items-center justify-between">
                <span>Letter Signature:</span>
                <span className="font-serif italic font-medium text-rose-100">{formData.myName || 'Your Name'}</span>
              </div>
            </div>
          )}

          {/* TAB 6: FINAL FOREVER MESSAGE */}
          {activeTab === 'forever' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-400/20 text-xs text-rose-200 leading-relaxed">
                <strong>Final Forever Section:</strong> Edit the lines that reveal progressively during the emotional finale near the end of the site.
              </div>

              <div className="space-y-3">
                {formData.foreverLines.map((line, idx) => (
                  <div key={idx} className="space-y-1">
                    <label className="block text-[11px] uppercase tracking-wider text-rose-300/70">
                      Line {idx + 1}
                    </label>
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          foreverLines: prev.foreverLines.map((l, i) => (i === idx ? val : l)),
                        }));
                      }}
                      className="w-full px-4 py-2 rounded-xl bg-black/40 border border-rose-500/25 text-white text-sm focus:outline-hidden"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: BIRTHDAY MESSAGE */}
          {activeTab === 'birthday' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-rose-300/80 mb-1.5 font-medium">
                  Final Birthday Message Title
                </label>
                <input
                  type="text"
                  value={formData.finalMessageTitle}
                  onChange={(e) => setFormData({ ...formData, finalMessageTitle: e.target.value })}
                  placeholder="Happy Birthday, My Entire Universe"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-hidden"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-wider text-rose-300/80 font-medium">
                  Message Paragraphs
                </label>
                {formData.finalMessageContent.map((para, i) => (
                  <textarea
                    key={i}
                    rows={3}
                    value={para}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        finalMessageContent: prev.finalMessageContent.map((p, idx) =>
                          idx === i ? val : p
                        ),
                      }));
                    }}
                    className="w-full px-4 py-2 rounded-xl bg-black/40 border border-rose-500/25 text-white text-sm focus:outline-hidden"
                  />
                ))}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-rose-300/80 mb-1.5 font-medium">
                  Closing Signature Line
                </label>
                <input
                  type="text"
                  value={formData.finalSignature}
                  onChange={(e) => setFormData({ ...formData, finalSignature: e.target.value })}
                  placeholder="With all my love & soul, now and forever."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 8: OUR SONG (SPOTIFY) */}
          {activeTab === 'song' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-400/20 text-xs text-rose-200 leading-relaxed">
                <strong>Our Song (Kept Exactly As Is):</strong> The website plays the exact single track <em>Pondattee</em> via the official Spotify player as the soundtrack of your love story.
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-rose-500/20 space-y-3">
                <div>
                  <span className="text-xs uppercase tracking-wider text-rose-300/70 block mb-1">Track Name</span>
                  <span className="font-serif text-xl text-white font-medium">{formData.songTitle}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-rose-300/70 block mb-1">Artist</span>
                  <span className="text-sm text-rose-200">{formData.songArtist}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-rose-300/70 block mb-1">Spotify URL</span>
                  <a
                    href={formData.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#1DB954] hover:underline break-all"
                  >
                    {formData.spotifyUrl}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions (SAVE, PREVIEW, RESET/UNDO) */}
        <div className="px-5 sm:px-6 py-4 border-t border-rose-500/20 bg-rose-950/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            {saveSuccess ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Saved permanently to database & storage!
              </span>
            ) : (
              <button
                onClick={handleUndo}
                className="text-xs text-rose-300/70 hover:text-rose-100 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset / Undo Unsaved Changes</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* PREVIEW BUTTON */}
            <button
              onClick={handlePreview}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full border border-rose-400/30 bg-black/40 hover:bg-black/60 text-xs text-rose-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>PREVIEW</span>
            </button>

            {/* SAVE CHANGES BUTTON */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 sm:flex-initial px-7 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-xl hover:scale-105 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'SAVING...' : 'SAVE CHANGES'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
