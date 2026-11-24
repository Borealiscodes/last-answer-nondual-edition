import { FP_ONE, fpClamp } from './core.js';

// Vowel formant pairs [F1, F2] in Hz for expressive retro vocal synthesis
const VOWEL_FORMANTS = Array.of(
  Array.of(730, 1090), // 'a'
  Array.of(530, 1840), // 'e'
  Array.of(270, 2290), // 'i'
  Array.of(570, 840),  // 'o'
  Array.of(300, 870)   // 'u'
);

export class PiperVoiceBridge {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.timeData = null;
    this.bufferCache = new Map();
    this.activeSource = null;
    this.formantTimer = null;
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
    if (this.formantTimer !== null) {
      window.clearInterval(this.formantTimer);
      this.formantTimer = null;
    }
    this.fallbackActive = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {
        // Ignore
      }
    }
  }

  async _loadWavBuffer(fileUrl) {
    if (this.bufferCache.has(fileUrl)) {
      return this.bufferCache.get(fileUrl);
    }
    try {
      const res = await fetch(fileUrl, { cache: 'no-store' });
      if (!res.ok) {
        return null;
      }
      const arr = await res.arrayBuffer();
      if (arr.byteLength < 64) {
        return null;
      }
      const decoded = await this.ctx.decodeAudioData(arr);
      this.bufferCache.set(fileUrl, decoded);
      return decoded;
    } catch (_) {
      return null;
    }
  }

  _speakWebSpeech(cue) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }
    try {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices ? synth.getVoices() : [];
      const enVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
      const utter = new SpeechSynthesisUtterance(cue.text);

      if (enVoices.length > 0) {
        utter.voice = cue.speaker === 'VOICE'
          ? enVoices[0]
          : enVoices[enVoices.length > 1 ? 1 : 0];
      }
      utter.rate = cue.speaker === 'VOICE' ? 1.0 : 1.12;
      utter.pitch = cue.speaker === 'VOICE' ? 0.85 : 1.15;
      utter.volume = 1.0;

      utter.onend = () => {
        this.fallbackActive = false;
        if (this.formantTimer !== null) {
          window.clearInterval(this.formantTimer);
          this.formantTimer = null;
        }
      };

      // Small delay avoids Android Chrome dropping utterances right after cancel()
      window.setTimeout(() => {
        if (!this.muted) {
          synth.speak(utter);
        }
      }, 45);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Audible WebAudio dual-formant syllable synthesizer (Banjo-Kazooie / Undertale / retro-TTS style)
   * so speech is always heard clearly even when offline WAVs aren't pulled yet.
   */
  _startFormantVocalizer(cue) {
    const words = cue.text.trim().split(/\s+/);
    let wordIdx = 0;
    const isVoice = cue.speaker === 'VOICE';
    const basePitch = isVoice ? 118 : 178;
    const stepMs = isVoice ? 135 : 108;

    const emitSyllable = () => {
      if (this.muted || !this.ctx || wordIdx >= words.length) {
        if (this.formantTimer !== null) {
          window.clearInterval(this.formantTimer);
          this.formantTimer = null;
        }
        return;
      }

      const word = words[wordIdx++];
      const charCode = word.charCodeAt(0) || 65;
      const vowel = VOWEL_FORMANTS[charCode % VOWEL_FORMANTS.length];
      const pitchJitter = ((charCode % 7) - 3) * (isVoice ? 3.5 : 5.5);
      const t = this.ctx.currentTime + 0.005;
      const dur = stepMs / 1000 * 0.78;

      const osc = this.ctx.createOscillator();
      osc.type = isVoice ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(basePitch + pitchJitter, t);
      osc.frequency.linearRampToValueAtTime(basePitch + pitchJitter * 0.6, t + dur);

      const f1 = this.ctx.createBiquadFilter();
      f1.type = 'bandpass';
      f1.frequency.setValueAtTime(vowel[0], t);
      f1.Q.setValueAtTime(5.5, t);

      const f2 = this.ctx.createBiquadFilter();
      f2.type = 'bandpass';
      f2.frequency.setValueAtTime(vowel[1], t);
      f2.Q.setValueAtTime(6.5, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.26, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      osc.connect(f1);
      osc.connect(f2);
      f1.connect(gain);
      f2.connect(gain);
      gain.connect(this.analyser);

      osc.start(t);
      osc.stop(t + dur + 0.01);
    };

    emitSyllable();
    this.formantTimer = window.setInterval(emitSyllable, stepMs);
  }

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

    const estWords = Math.max(4, cue.text.split(/\s+/).length);
    this.fallbackActive = true;
    this.fallbackStart = performance.now();
    this.fallbackDuration = estWords * 260;

    this._speakWebSpeech(cue);
    this._startFormantVocalizer(cue);

    return { mode: 'formant-tts', file: cue.file };
  }

  getVoiceEnergy() {
    if (this.muted) return 0;

    if ((this.activeSource || this.formantTimer !== null) && this.analyser && this.timeData) {
      this.analyser.getByteTimeDomainData(this.timeData);
      let sumSq = 0;
      for (let i = 0; i < this.timeData.length; i++) {
        const norm = (this.timeData[i] - 128) / 128;
        sumSq += norm * norm;
      }
      const rms = Math.sqrt(sumSq / this.timeData.length);
      const scaled = Math.round(Math.min(1, rms * 4.2) * FP_ONE);
      if (scaled > 0) {
        return fpClamp(scaled, 0, FP_ONE);
      }
    }

    if (this.fallbackActive) {
      const elapsed = performance.now() - this.fallbackStart;
      if (elapsed >= this.fallbackDuration) {
        this.fallbackActive = false;
        return 0;
      }
      const syllableWave = Math.abs(Math.sin(elapsed * 0.019)) * (0.6 + 0.4 * Math.sin(elapsed * 0.005));
      return fpClamp(Math.round(syllableWave * FP_ONE), 0, FP_ONE);
    }

    return 0;
  }
}
