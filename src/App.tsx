import React, { useState, useEffect } from 'react';
import { defaultPersonalization } from './data/defaultPersonalization';
import { PersonalizationData } from './types/personalization';
import { StarfieldBackground } from './components/StarfieldBackground';
import { OpeningProposal } from './components/OpeningProposal';
import { BirthdayHero } from './components/BirthdayHero';
import { Navbar } from './components/Navbar';
import { PhotoWorld } from './components/PhotoWorld';
import { SillyMemories } from './components/SillyMemories';
import { ThingsILove } from './components/ThingsILove';
import { LoveLetter } from './components/LoveLetter';
import { OurSongSection } from './components/OurSongSection';
import { ForeverSection } from './components/ForeverSection';
import { FinalMessage } from './components/FinalMessage';
import { Footer } from './components/Footer';
import { FloatingMusicPlayer } from './components/FloatingMusicPlayer';
import { PersonalizationModal } from './components/PersonalizationModal';
import { OwnerAuthModal } from './components/OwnerAuthModal';

const LOCAL_STORAGE_KEY = 'romantic_birthday_personalization_v1';
const SESSION_AUTH_KEY = 'owner_authenticated_session';

export default function App() {
  const [data, setData] = useState<PersonalizationData>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.photos) && parsed.photos.length === 12) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read cached personalization', e);
    }
    return defaultPersonalization;
  });

  const [hasAcceptedProposal, setHasAcceptedProposal] = useState(false);
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch saved personalization from persistent database backend (Single Source of Truth)
  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const res = await fetch('/api/personalization');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setData(json.data);
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data));
            } catch (err) {
              console.warn('LocalStorage save error:', err);
            }
          }
        }
      } catch (err) {
        console.warn('Backend fetch failed, using local fallback:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedData();

    // Check URL parameters for owner intent (?admin=true, ?owner=true, ?edit=true)
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('edit') === 'true' || params.get('admin') === 'true' || params.get('owner') === 'true') {
        const isAuth = sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
        if (isAuth) {
          setIsPersonalizationOpen(true);
        } else {
          setIsAuthModalOpen(true);
        }
      }
    } catch (e) {
      // Ignore in non-browser environments
    }
  }, []);

  // Listen for owner shortcut (Ctrl+Shift+E / Cmd+Shift+E)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        const isAuth = sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
        if (isAuth) {
          setIsPersonalizationOpen((prev) => !prev);
        } else {
          setIsAuthModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAuthenticated = () => {
    try {
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
    } catch (e) {
      // ignore
    }
    setIsAuthModalOpen(false);
    setIsPersonalizationOpen(true);
  };

  // Save updated data to backend database and cache
  const handleSaveData = async (newData: PersonalizationData): Promise<boolean> => {
    try {
      // 1. Update React state immediately
      setData(newData);

      // 2. Cache in localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }

      // 3. Persist to Express database file
      const res = await fetch('/api/personalization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });

      if (!res.ok) {
        throw new Error('Server returned non-200');
      }

      return true;
    } catch (err) {
      console.error('Failed to persist personalization:', err);
      return false;
    }
  };

  const handleResetData = async () => {
    try {
      setData(defaultPersonalization);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultPersonalization));
      await fetch('/api/reset-personalization', { method: 'POST' });
    } catch (e) {
      console.error('Error resetting data:', e);
    }
  };

  const handleClosePersonalization = () => {
    setIsPersonalizationOpen(false);
    // Clean URL query parameter so recipient view is totally clean
    if (window.location.search) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080206] text-[#fbf5ef] overflow-x-hidden selection:bg-[#991b3e] selection:text-white">
      {/* Background Animated Stardust & Glowing Cosmos */}
      <StarfieldBackground />

      {/* OPENING PROPOSAL EXPERIENCE */}
      {!hasAcceptedProposal && (
        <OpeningProposal
          herName={data.herName}
          onAccept={() => setHasAcceptedProposal(true)}
        />
      )}

      {/* MAIN BIRTHDAY EXPERIENCE (100% CLEAN RECIPIENT VIEW) */}
      {hasAcceptedProposal && (
        <div className="relative z-10 animate-in fade-in duration-700">
          {/* Navigation (Strict 3-zone contract, zero edit buttons) */}
          <Navbar
            onOurSongClick={() => scrollToSection('our-song')}
          />

          {/* Birthday Reveal Hero */}
          <BirthdayHero
            herName={data.herName}
            birthdayDate={data.birthdayDate}
            onExploreClick={() => scrollToSection('gallery')}
          />

          {/* 12 Personal Photos World (Cinematic & Polaroid) */}
          <PhotoWorld photos={data.photos} />

          {/* Silly Memories Section */}
          <SillyMemories
            photos={data.photos}
            title={data.sillyMemoriesTitle}
            note={data.sillyMemoriesNote}
          />

          {/* Things I Love About You (Including Her Eyes & Cheeks Features) */}
          <ThingsILove
            lovePoints={data.lovePoints}
            eyesQuote={data.eyesQuote}
            eyesNote={data.eyesNote}
            cheeksQuote={data.cheeksQuote}
            cheeksNote={data.cheeksNote}
          />

          {/* Interactive Love Letter */}
          <LoveLetter
            herName={data.herName}
            myName={data.myName}
            salutation={data.letterSalutation}
            paragraphs={data.letterParagraphs}
            signoff={data.letterSignoff}
          />

          {/* Single Song Section: Pondattee */}
          <OurSongSection
            songTitle={data.songTitle}
            songArtist={data.songArtist}
            spotifyUrl={data.spotifyUrl}
            spotifyTrackId={data.spotifyTrackId}
          />

          {/* The Emotional Final Forever Section */}
          <ForeverSection
            herName={data.herName}
            lines={data.foreverLines}
          />

          {/* Final Birthday Message */}
          <FinalMessage
            title={data.finalMessageTitle}
            content={data.finalMessageContent}
            signature={data.finalSignature}
            myName={data.myName}
            onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />

          {/* Clean Recipient Footer (No admin controls) */}
          <Footer
            herName={data.herName}
            myName={data.myName}
            birthdayDate={data.birthdayDate}
          />

          {/* Floating Music Player */}
          <FloatingMusicPlayer
            songTitle={data.songTitle}
            songArtist={data.songArtist}
            spotifyUrl={data.spotifyUrl}
            spotifyTrackId={data.spotifyTrackId}
          />
        </div>
      )}

      {/* OWNER PASSKEY AUTHENTICATION MODAL */}
      <OwnerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />

      {/* SEPARATE OWNER PERSONALIZATION PANEL */}
      <PersonalizationModal
        isOpen={isPersonalizationOpen}
        onClose={handleClosePersonalization}
        data={data}
        onSave={handleSaveData}
        onReset={handleResetData}
      />
    </div>
  );
}
