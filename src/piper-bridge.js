import { FP_ONE, fpClamp } from './core.js';

/**
 * Piper TTS playback bridge + real-time Q16.16 RMS amplitude extractor.
 * Plays pre-rendered FNV-1a hashed `audio/<hash>.wav` files via WebAudio AnalyserNode
 * so The Voice's Bezier manifold deforms in exact sync with speech syllables.
 * Falls back cleanly to Web Speech API / syllable envelope if .wav files are absent.
 */
export class PiperVoiceBridge {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.timeData = null;
    this.bufferCache = new Map();
    this.activeSource = null;
    this.fallbackActive = false;
    this.fallbackStart = 0;
    this.fallbackDuration = 0;
    this.muted = false;
  }

  ensureContext(sharedCtx = null) {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = sharedCtx || new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.65;
      this.timeData = new Uint8Array(this.analyser.fftSize);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.muted) {
      this.stopCurrent();
    }
  }

  stopCurrent() {
    if (this.activeSource) {
      try {
        this.activeSource.stop();
        this.activeSource.disconnect();
      } catch (_) {
        // Ignore already-stopped nodes
      }
      this.activeSource = null;
    }
    this.fallbackActive = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  async _loadWavBuffer(fileUrl) {
    if (this.bufferCache.has(fileUrl)) {
      return this.bufferCache.get(fileUrl);
    }
    try {
      const res = await fetch(fileUrl);
      if (!res.ok) {
        this.bufferCache.set(fileUrl, null);
        return null;
      }
      const arr = await res.arrayBuffer();
      const decoded = await this.ctx.decodeAudioData(arr);
      this.bufferCache.set(fileUrl, decoded);
      return decoded;
    } catch (_) {
      this.bufferCache.set(fileUrl, null);
      return null;
    }
  }

  /**
   * Speak a cue from `audio/<hash>.wav` (Piper TTS), falling back to browser TTS + cadence envelope.
   */
  async speakCue(cue, sharedCtx = null) {
    if (!cue || this.muted) return { mode: 'muted' };
    this.ensureContext(sharedCtx);
    this.stopCurrent();

    const buffer = await this._loadWavBuffer(cue.file);
    if (buffer) {
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(this.analyser);
      src.onended = () => {
        if (this.activeSource === src) {
          this.activeSource = null;
        }
      };
      this.activeSource = src;
      src.start(0);
      return { mode: 'piper-wav', file: cue.file };
    }

    // Fallback: deterministic syllable cadence envelope + optional browser SpeechSynthesis
    const estWords = Math.max(4, cue.text.split(/\s+/).length);
    this.fallbackActive = true;
    this.fallbackStart = performance.now();
    this.fallbackDuration = estWords * 340;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const utter = new SpeechSynthesisUtterance(cue.text);
        utter.lang = 'en-GB';
        utter.rate = cue.speaker === 'VOICE' ? 1.04 : 1.12;
        utter.pitch = cue.speaker === 'VOICE' ? 0.85 : 1.05;
        utter.onend = () => {
          this.fallbackActive = false;
        };
        utter.onerror = () => {
          this.fallbackActive = false;
        };
        window.speechSynthesis.speak(utter);
      } catch (_) {
        // Keep cadence envelope active even if SpeechSynthesis is unavailable
      }
    }

    return { mode: 'fallback-synth', file: cue.file };
  }

  /**
   * Returns current speech amplitude in Q16.16 [0..FP_ONE] for Bezier manifold deformation.
   */
  getVoiceEnergy() {
    if (this.muted) return 0;

    if (this.activeSource && this.analyser && this.timeData) {
      this.analyser.getByteTimeDomainData(this.timeData);
      let sumSq = 0;
      for (let i = 0; i < this.timeData.length; i++) {
        const norm = (this.timeData[i] - 128) / 128;
        sumSq += norm * norm;
      }
      const rms = Math.sqrt(sumSq / this.timeData.length);
      const scaled = Math.round(Math.min(1, rms * 3.6) * FP_ONE);
      return fpClamp(scaled, 0, FP_ONE);
    }

    if (this.fallbackActive) {
      const elapsed = performance.now() - this.fallbackStart;
      if (elapsed >= this.fallbackDuration) {
        this.fallbackActive = false;
        return 0;
      }
      // Synthetic syllable pulse envelope (~5.5 Hz cadence)
      const syllableWave = Math.abs(Math.sin(elapsed * 0.0175)) * (0.55 + 0.45 * Math.sin(elapsed * 0.0043));
      return fpClamp(Math.round(syllableWave * FP_ONE), 0, FP_ONE);
    }

    return 0;
  }
}
