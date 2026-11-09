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

  // Dramatic broken streak sound when streak/combo stops/padam
  public playStreakBroken(lostStreak: number = 2) {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Shatter / fizzle descending slide
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(480, now);
      osc1.frequency.exponentialRampToValueAtTime(120, now + 0.35);

      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // 2. Descending minor sad notes ("broken flame" arpeggio)
      const sadNotes = [523.25, 466.16, 415.30, 329.63]; // C5, Bb4, Ab4, E4
      sadNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = now + 0.05 + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.2, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.28);
      });

      // 3. Extinguishing noise/steam puff (fizzle)
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.25);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // 4. If huge streak (>= 10 Fever Mode), add a heavy resonant low gong of loss
      if (lostStreak >= 8) {
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(110, now + 0.15);
        sub.frequency.exponentialRampToValueAtTime(45, now + 0.55);

        subGain.gain.setValueAtTime(0.28, now + 0.15);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        sub.connect(subGain);
        subGain.connect(this.ctx.destination);
        sub.start(now + 0.15);
        sub.stop(now + 0.55);
      }
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

  // 5x Streak Combo Fire Sparks Sound
  public playCombo5() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Rapid ascending triad with brilliant overtone sizzle
      const freqs = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = now + idx * 0.045;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.22, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.22);
      });
    } catch {
      // Audio not ready
    }
  }

  // 10x Fever Mode (Super Reflex) Activation Fanfare & Bass Punch
  public playFeverMode() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // High-energy ascending heroic fanfare
      const powerNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
      powerNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = now + idx * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.18, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.38);
      });

      // Warm sub-bass punch for fiery impact
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, now);
      sub.frequency.exponentialRampToValueAtTime(55, now + 0.45);
      subGain.gain.setValueAtTime(0.3, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.45);
    } catch {
      // Audio not ready
    }
  }

  // Anime Stretch Punch (Gomu-Gomu) sound
  public playPunch() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Rubber stretch whoosh
      const whoosh = this.ctx.createOscillator();
      const whooshGain = this.ctx.createGain();
      whoosh.type = 'sine';
      whoosh.frequency.setValueAtTime(300, now);
      whoosh.frequency.exponentialRampToValueAtTime(900, now + 0.12);
      whooshGain.gain.setValueAtTime(0.2, now);
      whooshGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      whoosh.connect(whooshGain);
      whooshGain.connect(this.ctx.destination);
      whoosh.start(now);
      whoosh.stop(now + 0.15);

      // 2. Heavy punch impact
      const punch = this.ctx.createOscillator();
      const punchGain = this.ctx.createGain();
      punch.type = 'triangle';
      punch.frequency.setValueAtTime(180, now + 0.1);
      punch.frequency.exponentialRampToValueAtTime(45, now + 0.35);
      punchGain.gain.setValueAtTime(0.35, now + 0.1);
      punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      punch.connect(punchGain);
      punchGain.connect(this.ctx.destination);
      punch.start(now + 0.1);
      punch.stop(now + 0.35);
    } catch {
      // Audio not ready
    }
  }

  // Monster attacking player sound (Water blast / claw swipe)
  public playMonsterAttack() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Low monster roar/swipe
      const roar = this.ctx.createOscillator();
      const roarGain = this.ctx.createGain();
      roar.type = 'sawtooth';
      roar.frequency.setValueAtTime(130, now);
      roar.frequency.linearRampToValueAtTime(60, now + 0.3);
      roarGain.gain.setValueAtTime(0.25, now);
      roarGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      roar.connect(roarGain);
      roarGain.connect(this.ctx.destination);
      roar.start(now);
      roar.stop(now + 0.3);
    } catch {
      // Audio not ready
    }
  }

  // Defeating sea monster victory jingle
  public playDefeatMonster() {
    this.playFanfare();
  }

  // Celebratory victory fanfare
  public playFanfare() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch {
      // Audio not ready
    }
  }

  // Game Over pirate sound
  public playGameOver() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.16);
        gain.gain.setValueAtTime(0.18, now + idx * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.16);
        osc.stop(now + idx * 0.16 + 0.4);
      });
    } catch {
      // Audio not ready
    }
  }

  // Retro 8-bit synthetic short cheerful sound for correct answer / attack
  public play8BitAttack() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Fast cheerful 8-bit arpeggio: C5 -> E5 -> G5 -> C6
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = now + idx * 0.035;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square'; // Classic 8-bit square wave
        osc.frequency.setValueAtTime(freq, noteStart);
        
        gain.gain.setValueAtTime(0.2, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.08);
      });
    } catch {
      // Audio not ready
    }
  }

  // Retro 8-bit synthetic crunchy bass sound for wrong answer / taking hit
  public play8BitHit() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Descending low pitch square/sawtooth wave
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.28);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);

      // 2. Retro noise burst for impact crunch
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.15);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(800, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(100, now + 0.15);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      whiteNoise.start(now);
    } catch {
      // Audio not ready
    }
  }

  // Anime Sword Slash (Tebasan Nichirin Air/Api): High speed blade friction + sharp metallic slice
  public playSwordSlash() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Blade whoosh slice (rapid bandpass white noise sweep)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bpFilter = this.ctx.createBiquadFilter();
      bpFilter.type = 'bandpass';
      bpFilter.Q.setValueAtTime(3.5, now);
      bpFilter.frequency.setValueAtTime(1400, now);
      bpFilter.frequency.exponentialRampToValueAtTime(4800, now + 0.06);
      bpFilter.frequency.exponentialRampToValueAtTime(800, now + 0.18);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      noise.connect(bpFilter);
      bpFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // 2. Crisp blade resonance tone (metallic slice ping)
      const blade = this.ctx.createOscillator();
      const bladeGain = this.ctx.createGain();
      blade.type = 'triangle';
      blade.frequency.setValueAtTime(1864.66, now + 0.02); // Bb6
      blade.frequency.exponentialRampToValueAtTime(659.25, now + 0.22); // E5

      bladeGain.gain.setValueAtTime(0.25, now + 0.02);
      bladeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      blade.connect(bladeGain);
      bladeGain.connect(this.ctx.destination);
      blade.start(now + 0.02);
      blade.stop(now + 0.22);

      // 3. Ascending elemental shimmer
      const chord = [523.25, 783.99, 1046.50]; // C5, G5, C6
      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(freq, now + 0.03 + idx * 0.02);

        subGain.gain.setValueAtTime(0.12, now + 0.03 + idx * 0.02);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);
        subOsc.start(now + 0.03 + idx * 0.02);
        subOsc.stop(now + 0.25);
      });
    } catch {
      // Audio not ready
    }
  }

  // Heavy Demon Attack / Train Explosion Hit: Deep sub-bass drop + crunchy explosion blast
  public playExplosionHit() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Heavy sub-bass thump
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(160, now);
      sub.frequency.exponentialRampToValueAtTime(30, now + 0.35);

      subGain.gain.setValueAtTime(0.45, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.35);

      // 2. Low-frequency explosion roar
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.3);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.28);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // 3. Distortion sawtooth impact buzz
      const dist = this.ctx.createOscillator();
      const distGain = this.ctx.createGain();
      dist.type = 'sawtooth';
      dist.frequency.setValueAtTime(110, now);
      dist.frequency.linearRampToValueAtTime(45, now + 0.15);

      distGain.gain.setValueAtTime(0.22, now);
      distGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      dist.connect(distGain);
      distGain.connect(this.ctx.destination);
      dist.start(now);
      dist.stop(now + 0.15);
    } catch {
      // Audio not ready
    }
  }
}

export const sounds = new SoundManager();


