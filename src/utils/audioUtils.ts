/**
 * Ambient romantic harp & chime generator using Web Audio API
 * Provides gentle, ethereal romantic tones on interactions and as an ambient soundtrack
 */

class RomanticAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlayingAmbient = false;
  private ambientInterval: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft romantic chord / chime
  public playChime(freqs: number[] = [440, 554.37, 659.25, 880], duration = 2.5) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        // Soft envelope
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.08 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + duration);
      });
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Romantic celebratory flourish when she says YES
  public playYesCelebration() {
    const melody = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    melody.forEach((note, i) => {
      setTimeout(() => {
        this.playChime([note], 2.0);
      }, i * 160);
    });
  }

  // Subtle paper unfold sound effect
  public playLetterOpen() {
    this.playChime([329.63, 392.00, 493.88], 1.8);
  }

  // Gentle ambient romantic background notes
  public startAmbientLoop() {
    if (this.isPlayingAmbient) return;
    this.isPlayingAmbient = true;
    this.initContext();

    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C major
      [220.00, 261.63, 329.63, 440.00], // A minor
      [174.61, 220.00, 261.63, 349.23], // F major
      [196.00, 246.94, 293.66, 392.00], // G major
    ];

    let chordIndex = 0;
    const playNext = () => {
      if (!this.isPlayingAmbient) return;
      const currentChord = chords[chordIndex % chords.length];
      this.playChime(currentChord, 3.5);
      chordIndex++;
    };

    playNext();
    this.ambientInterval = setInterval(playNext, 4200);
  }

  public stopAmbientLoop() {
    this.isPlayingAmbient = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }

  public isAmbientPlaying() {
    return this.isPlayingAmbient;
  }
}

export const romanticAudio = new RomanticAudioSynthesizer();
