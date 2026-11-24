/**
 * Upbeat 16-bit platformer WebAudio chiptune sequencer & SFX engine.
 * Contrasts cosmic existential dread with bouncy major-key pulse/triangle grooves.
 */

const NOTE_FREQS = {
  REST: 0,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, Gs4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50, E6: 1318.51, G6: 1567.98
};

// 32-step (2-bar, 16th-note) jaunty Mario-esque C-major/G7 loop
const LEAD_PATTERN = [
  'E5', 'E5', 'REST', 'E5', 'REST', 'C5', 'E5', 'REST',
  'G5', 'REST', 'REST', 'REST', 'G4', 'REST', 'REST', 'REST',
  'C5', 'REST', 'REST', 'G4', 'REST', 'REST', 'E4', 'REST',
  'A4', 'REST', 'B4', 'REST', 'Bb4', 'A4', 'REST', 'G4'
];

const BASS_PATTERN = [
  'C3', 'REST', 'G3', 'REST', 'E3', 'REST', 'G3', 'REST',
  'G3', 'REST', 'D3', 'REST', 'B3', 'REST', 'G3', 'REST',
  'C3', 'REST', 'E3', 'REST', 'G3', 'REST', 'C4', 'REST',
  'F3', 'REST', 'A3', 'REST', 'G3', 'REST', 'B3', 'REST'
];

const HAT_PATTERN = [
  1, 0, 1, 0, 1, 0, 1, 1,
  1, 0, 1, 0, 1, 0, 1, 1,
  1, 0, 1, 0, 1, 0, 1, 1,
  1, 0, 1, 0, 1, 1, 1, 1
];

export class ChiptuneSynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.noiseBuffer = null;
    this.muted = false;
    this.playing = false;
    this.bpm = 132;
    this.stepIdx = 0;
    this.nextStepTime = 0;
    this.timerId = null;
  }

  ensureContext(sharedCtx = null) {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = sharedCtx || new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : 0.22;
      this.masterGain.connect(this.ctx.destination);
      this.noiseBuffer = this._createLfsrNoiseBuffer();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  _createLfsrNoiseBuffer() {
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    let lfsr = 0x7fff;
    for (let i = 0; i < length; i++) {
      const bit = ((lfsr >> 0) ^ (lfsr >> 1)) & 1;
      lfsr = (lfsr >> 1) | (bit << 14);
      data[i] = (lfsr & 1) ? 0.5 : -0.5;
    }
    return buffer;
  }

  setBpm(bpm) {
    this.bpm = Math.max(90, Math.min(220, Number(bpm) || 132));
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.22, this.ctx.currentTime, 0.015);
    }
    return this.muted;
  }

  toggleMute() {
    return this.setMuted(!this.muted);
  }

  start(sharedCtx = null) {
    this.ensureContext(sharedCtx);
    if (this.playing) return;
    this.playing = true;
    this.stepIdx = 0;
    this.nextStepTime = this.ctx.currentTime + 0.04;
    this.timerId = window.setInterval(() => this._scheduler(), 25);
  }

  stop() {
    this.playing = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  _scheduler() {
    if (!this.playing || !this.ctx) return;
    const secondsPer16th = 60 / this.bpm / 4;
    while (this.nextStepTime < this.ctx.currentTime + 0.1) {
      this._scheduleStep(this.stepIdx, this.nextStepTime, secondsPer16th);
      this.nextStepTime += secondsPer16th;
      this.stepIdx = (this.stepIdx + 1) & 31;
    }
  }

  _scheduleStep(idx, time, stepDur) {
    const leadNote = LEAD_PATTERN[idx];
    const bassNote = BASS_PATTERN[idx];
    const hat = HAT_PATTERN[idx];

    if (leadNote && NOTE_FREQS[leadNote] > 0) {
      this._playTone(NOTE_FREQS[leadNote], 'square', time, stepDur * 0.78, 0.16);
    }
    if (bassNote && NOTE_FREQS[bassNote] > 0) {
      this._playTone(NOTE_FREQS[bassNote], 'triangle', time, stepDur * 0.85, 0.28);
    }
    if (hat) {
      this._playNoiseHat(time, 0.035, idx % 4 === 2 ? 0.09 : 0.045);
    }
  }

  _playTone(freq, type, startTime, duration, peakGain) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  }

  _playNoiseHat(startTime, duration, peakGain) {
    if (!this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(5200, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(peakGain, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(startTime);
    src.stop(startTime + duration + 0.005);
  }

  /**
   * Play ironic upbeat Mario-style SFX on cosmic revelations & reassembly.
   */
  playSfx(name) {
    if (this.muted) return;
    this.ensureContext();
    const t = this.ctx.currentTime + 0.01;

    switch (name) {
      case 'COIN':
        this._playTone(NOTE_FREQS.B5, 'square', t, 0.075, 0.24);
        this._playTone(NOTE_FREQS.E6, 'square', t + 0.075, 0.28, 0.24);
        break;

      case 'ONE_UP': {
        const notes = ['E5', 'G5', 'E6', 'C6', 'D6', 'G6'];
        notes.forEach((n, i) => {
          this._playTone(NOTE_FREQS[n], 'square', t + i * 0.065, 0.06, 0.22);
        });
        break;
      }

      case 'POWERUP': {
        const notes = ['C4', 'G4', 'C5', 'E5', 'G5', 'C6', 'E6'];
        notes.forEach((n, i) => {
          this._playTone(NOTE_FREQS[n], 'square', t + i * 0.055, 0.05, 0.21);
        });
        break;
      }

      case 'PIPE_WARP':
        for (let i = 0; i < 3; i++) {
          const offset = t + i * 0.09;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(420, offset);
          osc.frequency.exponentialRampToValueAtTime(110, offset + 0.075);
          gain.gain.setValueAtTime(0.2, offset);
          gain.gain.exponentialRampToValueAtTime(0.0001, offset + 0.08);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(offset);
          osc.stop(offset + 0.085);
        }
        break;

      case 'STAR_FANFARE':
      case 'STAGE_CLEAR': {
        const notes = ['G4', 'C5', 'E5', 'G5', 'E5', 'G5'];
        const durs = [0.08, 0.08, 0.08, 0.14, 0.08, 0.32];
        let cursor = t;
        notes.forEach((n, i) => {
          this._playTone(NOTE_FREQS[n], 'square', cursor, durs[i], 0.24);
          cursor += durs[i] + 0.015;
        });
        break;
      }

      case 'BUMP':
      default: {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(65, t + 0.09);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.095);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
      }
    }
  }
}
