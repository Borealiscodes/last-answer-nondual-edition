/**
 * Upbeat 4-channel, 8-bar (128-step) 16-bit platformer WebAudio sequencer & SFX engine.
 * Channels:
 *   1. Lead Pulse (bright syncopated Mario-esque melody)
 *   2. Harmony Square (counter-melody & upbeat off-beat stabs)
 *   3. Triangle Bass (bouncing walking bassline with octave leaps)
 *   4. Percussion (pitch-swept kick + LFSR noise snare & hi-hats)
 */

const NOTE_FREQS = {
  _: 0,
  G2: 98.00, A2: 110.00, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, Fs3: 185.00, G3: 196.00, Gs3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Gs4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Gs5: 830.61, A5: 880.00, Bb5: 932.33, B5: 987.77,
  C6: 1046.50, D6: 1174.66, E6: 1318.51, G6: 1567.98
};

// 128 steps = 8 bars of 16th notes (Section A: Bars 1-4, Section B: Bars 5-8)
const LEAD_NOTES = Array.of(
  // Bar 1: Bouncy opening hook
  'E5', 'E5', '_', 'E5', '_', 'C5', 'E5', '_', 'G5', '_', '_', '_', 'G4', '_', '_', '_',
  // Bar 2: Syncopated descent
  'C5', '_', '_', 'G4', '_', '_', 'E4', '_', 'A4', '_', 'B4', '_', 'Bb4', 'A4', '_', '_',
  // Bar 3: Triplet-feel climb
  'G4', 'E5', 'G5', 'A5', '_', 'F5', 'G5', '_', 'E5', '_', 'C5', 'D5', 'B4', '_', '_', '_',
  // Bar 4: Turnaround riff
  'C5', '_', 'G4', '_', 'E4', '_', 'A4', 'B4', 'A4', 'Gs4', 'A4', '_', 'G4', '_', '_', '_',
  // Bar 5 (Section B): Playful call
  'G5', 'Fs5', 'F5', 'Ds5', '_', 'E5', '_', 'Gs4', 'A4', 'C5', '_', 'A4', 'C5', 'D5', '_', '_',
  // Bar 6: Jaunty answer
  'G5', 'Fs5', 'F5', 'Ds5', '_', 'E5', '_', 'C6', '_', 'C6', 'C6', '_', '_', '_', '_', '_',
  // Bar 7: Chromatic walk-up
  'G5', 'Fs5', 'F5', 'Ds5', '_', 'E5', '_', 'Gs4', 'A4', 'C5', '_', 'A4', 'C5', 'D5', '_', '_',
  // Bar 8: Bright cadence back to A
  'Eb5', '_', '_', 'D5', '_', '_', 'C5', '_', 'G4', 'E4', 'C4', '_', 'G4', '_', '_', '_'
);

const HARM_NOTES = Array.of(
  // Bar 1
  'C4', 'C4', '_', 'C4', '_', 'G3', 'C4', '_', 'E4', '_', '_', '_', 'B3', '_', '_', '_',
  // Bar 2
  'G3', '_', '_', 'E3', '_', '_', 'C3', '_', 'F3', '_', 'G3', '_', 'Fs3', 'F3', '_', '_',
  // Bar 3
  'E3', 'C4', 'E4', 'F4', '_', 'D4', 'E4', '_', 'C4', '_', 'A3', 'B3', 'G3', '_', '_', '_',
  // Bar 4
  'G3', '_', 'E3', '_', 'C3', '_', 'F3', 'G3', 'F3', 'E3', 'F3', '_', 'D3', '_', 'G3', '_',
  // Bar 5
  '_', '_', 'E4', '_', '_', 'C4', '_', '_', '_', '_', 'F4', '_', '_', 'F4', '_', '_',
  // Bar 6
  '_', '_', 'E4', '_', '_', 'C4', '_', 'G5', '_', 'G5', 'G5', '_', '_', '_', '_', '_',
  // Bar 7
  '_', '_', 'E4', '_', '_', 'C4', '_', '_', '_', '_', 'F4', '_', '_', 'F4', '_', '_',
  // Bar 8
  'C4', '_', '_', 'B3', '_', '_', 'G3', '_', 'E3', 'C3', 'G2', '_', 'B3', '_', 'D4', '_'
);

const BASS_NOTES = Array.of(
  // Bar 1: C major walking bounce
  'C3', '_', 'G3', '_', 'E3', '_', 'G3', '_', 'G2', '_', 'D3', '_', 'B2', '_', 'D3', '_',
  // Bar 2: C -> F -> G7
  'C3', '_', 'E3', '_', 'G3', '_', 'C3', '_', 'F3', '_', 'C4', '_', 'G3', '_', 'B3', '_',
  // Bar 3: C -> F -> C -> G
  'C3', '_', 'G3', '_', 'F3', '_', 'A3', '_', 'C3', '_', 'G3', '_', 'G2', '_', 'B2', 'D3',
  // Bar 4: Turnaround
  'C3', '_', 'G2', '_', 'C3', '_', 'F3', '_', 'D3', '_', 'Fs3', '_', 'G3', 'F3', 'E3', 'D3',
  // Bar 5: Section B octave bounce
  'C3', '_', 'G3', '_', 'C4', '_', 'G3', '_', 'F3', '_', 'C4', '_', 'F4', '_', 'C4', '_',
  // Bar 6: High staccato hits
  'C3', '_', 'G3', '_', 'C4', '_', 'G3', 'C5', '_', 'C5', 'C5', '_', 'G3', '_', 'E3', '_',
  // Bar 7
  'C3', '_', 'G3', '_', 'C4', '_', 'G3', '_', 'F3', '_', 'C4', '_', 'F4', '_', 'A3', '_',
  // Bar 8: Ab -> Bb -> C cadence
  'Gs3', '_', 'Ds4', '_', 'Bb3', '_', 'F4', '_', 'C3', '_', 'G3', '_', 'C3', 'G2', 'C3', '_'
);

// K = Kick, S = Snare, H = Hi-Hat, . = Rest (128 steps)
const DRUM_PATTERN =
  'K.H.S.H.K.H.S.HH' +
  'K.H.S.H.K.K.S.HH' +
  'K.H.S.H.K.H.S.HH' +
  'K.H.S.H.K.S.S.SH' +
  'K.H.S.H.K.H.S.HH' +
  'K.H.S.HK.KK.S.HH' +
  'K.H.S.H.K.H.S.HH' +
  'K.H.S.H.K.S.K.SH';

// Add Eb4/Ds5 aliases
NOTE_FREQS.Eb5 = 622.25;
NOTE_FREQS.Ds5 = 622.25;
NOTE_FREQS.Ds4 = 311.13;

export class ChiptuneSynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.noiseBuffer = null;
    this.muted = false;
    this.playing = false;
    this.bpm = 136;
    this.stepIdx = 0;
    this.nextStepTime = 0;
    this.timerId = null;
  }

  ensureContext(sharedCtx = null) {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = sharedCtx || new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : 0.24;
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
    const length = Math.floor(sampleRate * 0.5);
    const buffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    let lfsr = 0x7fff;
    for (let i = 0; i < length; i++) {
      const bit = ((lfsr >> 0) ^ (lfsr >> 1)) & 1;
      lfsr = (lfsr >> 1) | (bit << 14);
      data[i] = (lfsr & 1) ? 0.6 : -0.6;
    }
    return buffer;
  }

  setBpm(bpm) {
    this.bpm = Math.max(96, Math.min(220, Number(bpm) || 136));
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.24, this.ctx.currentTime, 0.015);
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
    while (this.nextStepTime < this.ctx.currentTime + 0.12) {
      this._scheduleStep(this.stepIdx, this.nextStepTime, secondsPer16th);
      this.nextStepTime += secondsPer16th;
      this.stepIdx = (this.stepIdx + 1) & 127;
    }
  }

  _scheduleStep(idx, time, stepDur) {
    const leadNote = LEAD_NOTES[idx];
    const harmNote = HARM_NOTES[idx];
    const bassNote = BASS_NOTES[idx];
    const drum = DRUM_PATTERN.charAt(idx);

    if (leadNote && NOTE_FREQS[leadNote] > 0) {
      this._playTone(NOTE_FREQS[leadNote], 'square', time, stepDur * 0.82, 0.15);
    }
    if (harmNote && NOTE_FREQS[harmNote] > 0) {
      this._playTone(NOTE_FREQS[harmNote], 'sawtooth', time, stepDur * 0.72, 0.065);
    }
    if (bassNote && NOTE_FREQS[bassNote] > 0) {
      this._playTone(NOTE_FREQS[bassNote], 'triangle', time, stepDur * 0.88, 0.28);
    }

    if (drum === 'K') {
      this._playKick(time);
    } else if (drum === 'S') {
      this._playSnare(time);
    } else if (drum === 'H') {
      this._playHat(time);
    }
  }

  _playTone(freq, type, startTime, duration, peakGain) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  }

  _playKick(startTime) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(145, startTime);
    osc.frequency.exponentialRampToValueAtTime(42, startTime + 0.075);

    gain.gain.setValueAtTime(0.32, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(startTime);
    osc.stop(startTime + 0.085);
  }

  _playSnare(startTime) {
    if (!this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.14, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.075);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(startTime);
    src.stop(startTime + 0.08);
  }

  _playHat(startTime) {
    if (!this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6200, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.055, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.032);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(startTime);
    src.stop(startTime + 0.036);
  }

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
        const notes = Array.of('E5', 'G5', 'E6', 'C6', 'D6', 'G6');
        notes.forEach((n, i) => {
this._playTone(NOTE_FREQS[n], 'square', t + i * 0.065, 0.06, 0.22);
});
break;
}
case 'POWERUP': {
const notes = Array.of('C4', 'G4', 'C5', 'E5', 'G5', 'C6', 'E6');
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
const notes = Array.of('G4', 'C5', 'E5', 'G5', 'E5', 'G5');
const durs = Array.of(0.08, 0.08, 0.08, 0.14, 0.08, 0.32);
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
