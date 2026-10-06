/**
 * sound-effects.js
 * Avengers Procedural Web Audio API Sound Generator
 * Generates custom Marvel sci-fi sound effects in real-time with zero external audio files!
 */

class AvengersAudioEngine {
  constructor() {
    this.ctx = null;
    this.isEnabled = false; // Start muted by default or enabled on user gesture
    this.volume = 0.25; // Gentle, non-intrusive volume
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(forceState = null) {
    this.init();
    if (forceState !== null) {
      this.isEnabled = forceState;
    } else {
      this.isEnabled = !this.isEnabled;
    }
    return this.isEnabled;
  }

  // 1. Iron Man Repulsor Beam Charge & Blast (Home)
  playRepulsor() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // High pitch charging whine
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.25);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.45);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(this.volume * 0.7, t + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.5);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 2. Captain America Vibranium Shield Impact Ring (About)
  playShieldClang() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(784, t); // G5 note
      osc2.frequency.setValueAtTime(1174, t); // D6 harmonic

      gain.gain.setValueAtTime(this.volume * 0.8, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.85);
      osc2.stop(t + 0.85);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 3. Doctor Strange Mystic Portal Whoosh (Education)
  playPortalSparks() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.linearRampToValueAtTime(440, t + 0.3);
      osc.frequency.linearRampToValueAtTime(110, t + 0.7);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(2400, t + 0.35);
      filter.Q.value = 4;

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(this.volume * 0.6, t + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.75);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 4. Thor Thunder & Lightning Crackle (Skills)
  playThunder() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // Low bass thunder boom
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.6);

      gain.gain.setValueAtTime(this.volume * 0.9, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.7);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 5. Spider-Man Web Thwip (Projects)
  playWebThwip() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.18);

      gain.gain.setValueAtTime(this.volume * 0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 6. Wakanda Vibranium Kinetic Pulse / Infinity Stone Glow (Certifications)
  playKineticPulse() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.linearRampToValueAtTime(640, t + 0.2);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.5);

      gain.gain.setValueAtTime(this.volume * 0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.55);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 7. Holographic Comms Beep / Avengers Assemble (Contact)
  playHoloBeep() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [0, 0.08, 0.16].forEach((offset, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659 + idx * 165, t + offset);
        gain.gain.setValueAtTime(this.volume * 0.5, t + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + offset);
        osc.stop(t + offset + 0.1);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Click chime for buttons
  playClick() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, t);
      gain.gain.setValueAtTime(this.volume * 0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.07);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }
}

// Global instance
window.avengersAudio = new AvengersAudioEngine();
