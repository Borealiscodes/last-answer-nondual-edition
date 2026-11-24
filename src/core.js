/**
 * Deterministic Q16.16 fixed-point math, PRNG, and FNV-1a content hasher.
 * Adapted from Zen-Parable & non-dual-holonomy-psp for zero-drift execution.
 */

export const FP_SHIFT = 16;
export const FP_ONE = 1 << FP_SHIFT; // 65536
export const FP_HALF = 1 << (FP_SHIFT - 1); // 32768

export function toFixed(n) {
  return (n * FP_ONE) | 0;
}

export function fromFixed(fp) {
  return fp / FP_ONE;
}

export function fpMul(a, b) {
  return Number((BigInt(a) * BigInt(b)) >> BigInt(FP_SHIFT)) | 0;
}

export function fpDiv(a, b) {
  if (b === 0) return a >= 0 ? 0x7fffffff : -0x80000000;
  return Number((BigInt(a) << BigInt(FP_SHIFT)) / BigInt(b)) | 0;
}

export function fpClamp(val, min, max) {
  return val < min ? min : val > max ? max : val;
}

export function fpLerp(a, b, t) {
  return (a + fpMul(b - a, t)) | 0;
}

/**
 * Deterministic 256-entry Q16.16 sine lookup table for zero-float geometry & audio envelopes.
 */
const SIN_TABLE = new Int32Array(256);
for (let i = 0; i < 256; i++) {
  SIN_TABLE[i] = Math.round(Math.sin((i / 256) * Math.PI * 2) * FP_ONE);
}

/**
 * @param {number} angleIdx - Integer phase where 256 = 2*PI radians
 */
export function fpSin(angleIdx) {
  return SIN_TABLE[angleIdx & 255];
}

export function fpCos(angleIdx) {
  return SIN_TABLE[(angleIdx + 64) & 255];
}

/**
 * Deterministic Mulberry32 PRNG returning unsigned 32-bit integers.
 */
export function createRng(seed = 0x19801980) {
  let state = seed >>> 0;
  return function nextUint32() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (t ^ (t >>> 14)) >>> 0;
  };
}

/**
 * FNV-1a 32-bit hex hasher for 1:1 Piper TTS audio-to-dialogue manifest parity.
 */
export function fnv1aHex(text) {
  const normalized = String(text).trim().replace(/\s+/g, ' ');
  let hash = 0x811c9dc5;
  for (let i = 0; i < normalized.length; i++) {
    hash ^= normalized.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}
