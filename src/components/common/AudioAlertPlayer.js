/**
 * Web Audio API Alert Beep Generator for Emergency EOC HUD
 */
class SoundManager {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playWarningBeep(freq = 880, duration = 0.25, type = 'sawtooth') {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback inhibited by browser policy:', e);
    }
  }

  playDoubleCriticalAlert() {
    this.playWarningBeep(980, 0.15, 'sawtooth');
    setTimeout(() => {
      this.playWarningBeep(1240, 0.25, 'sawtooth');
    }, 180);
  }
}

export const soundManager = new SoundManager();
