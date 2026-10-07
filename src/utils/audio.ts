// Pure Web Audio API Sound Synthesizer for instant, zero-asset game audio effects

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(enabled?: boolean): boolean {
    if (typeof enabled === 'boolean') {
      this.soundEnabled = enabled;
    } else {
      this.soundEnabled = !this.soundEnabled;
    }
    return this.soundEnabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  // Play a crisp pleasant chime for correct answer
  public playCorrect(streak: number = 1) {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pitch increases slightly with streak
      const baseFreq = 587.33; // D5
      const pitchMultiplier = Math.min(1.8, 1 + (streak * 0.06));
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * pitchMultiplier, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * pitchMultiplier * 1.5, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);

      // Add harmonic sparkle for high streak
      if (streak >= 3) {
        const sparkle = this.ctx.createOscillator();
        const sparkleGain = this.ctx.createGain();
        sparkle.type = 'triangle';
        sparkle.frequency.setValueAtTime(baseFreq * pitchMultiplier * 2, now + 0.04);
        sparkleGain.gain.setValueAtTime(0.15, now + 0.04);
        sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        sparkle.connect(sparkleGain);
        sparkleGain.connect(this.ctx.destination);
        sparkle.start(now + 0.04);
        sparkle.stop(now + 0.3);
      }
    } catch {
      // Ignore audio failure if browser restricts
    }
  }

  // Low buzz for wrong answer
  public playWrong() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio not ready
    }
  }

  // Tap button click sound
  public playTap() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio not ready
    }
  }

  // Countdown tick
  public playTick(urgent: boolean = false) {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = urgent ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(urgent ? 900 : 600, now);

      gain.gain.setValueAtTime(urgent ? 0.15 : 0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio not ready
    }
  }

  // Victory fanfare for completed game or leaderboard top
  public playVictory() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = now + idx * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.2, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + (idx === notes.length - 1 ? 0.6 : 0.2));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + (idx === notes.length - 1 ? 0.6 : 0.2));
      });
    } catch {
      // Audio not ready
    }
  }

  // Power-up activation sound
  public playPowerup() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio not ready
    }
  }

  // Power-up or purchase sound
  public playBuy() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio not ready
    }
  }
}

export const sounds = new SoundManager();
