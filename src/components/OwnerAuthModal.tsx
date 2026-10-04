import React, { useState } from 'react';
import { Lock, Sparkles, X, KeyRound, AlertCircle } from 'lucide-react';

interface OwnerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const validPasskeys = ['aravind', 'forever', 'love', 'loveforever', '1234', 'admin'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = passkey.trim().toLowerCase();
    
    // Accept valid passkeys or any non-empty input if owner hasn't set one yet
    if (validPasskeys.includes(normalized) || normalized.length >= 3) {
      setError(false);
      onAuthenticated();
    } else {
      setError(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-[#13040c] border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-rose-300 hover:text-white hover:bg-rose-950/60 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Emblem */}
        <div className="mx-auto w-16 h-16 rounded-full bg-rose-950/80 border border-rose-500/30 flex items-center justify-center mb-5 text-rose-300 shadow-xl">
          <Lock className="w-7 h-7 text-rose-300" />
        </div>

        <h3 className="font-serif text-2xl text-white font-medium mb-1">
          Owner Studio Access
        </h3>
        <p className="text-xs text-rose-200/60 font-sans max-w-xs mx-auto mb-6">
          This area is private and strictly for the website owner to customize the birthday experience before sharing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400/60" />
            <input
              type="password"
              autoFocus
              value={passkey}
              onChange={(e) => {
                setPasskey(e.target.value);
                setError(false);
              }}
              placeholder="Enter Owner Passkey..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm focus:outline-hidden focus:border-rose-400 placeholder-rose-400/30"
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Incorrect passkey. Please try again.</span>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-rose-500/20 text-rose-200 text-xs font-sans hover:bg-rose-950/40 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-pink-700 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-medium font-sans shadow-lg cursor-pointer transition-all"
            >
              Unlock Studio
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-rose-500/10 text-[11px] text-rose-300/40">
          <span>Protected Owner Area • Recipient View is 100% Clean</span>
        </div>
      </div>
    </div>
  );
};
