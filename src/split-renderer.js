import {
  FP_ONE,
  fpMul,
  fpSin,
  fpCos,
  fpClamp,
  fromFixed
} from './core.js';

export const SCREEN_W = 480;
export const SCREEN_H = 272;
export const HALF_W = 240;

// 4x4 Bayer ordered dithering matrix [0..15]
const BAYER_4X4 = new Uint8Array([
   0,  8,  2, 10,
  12,  4, 14,  6,
   3, 11,  1,  9,
  15,  7, 13,  5
]);

/**
 * 256-entry CLUT8 retro-cosmic palette (ABGR 32-bit little-endian).
 *   0..63   : Deep void indigo -> Murray cyan/emerald EM plasma
 *   64..127 : Cosmic violet -> Voice gold/magenta harmonic fire
 *   128..191: Terminal amber & phosphor green HUD accents
 *   192..255: High-contrast dither ramps
 */
function buildClut8Palette() {
  const lut = new Uint32Array(256);
  const pack = (r, g, b) => (0xff000000 | ((b & 255) << 16) | ((g & 255) << 8) | (r & 255)) >>> 0;

  for (let i = 0; i < 64; i++) {
    const t = i / 63;
    lut[i] = pack(
      Math.round(8 + t * 40),
      Math.round(10 + t * 235),
      Math.round(24 + t * 231)
    );
  }
  for (let i = 0; i < 64; i++) {
    const t = i / 63;
    lut[64 + i] = pack(
      Math.round(24 + t * 231),
      Math.round(12 + t * 185),
      Math.round(42 + t * 140)
    );
  }
  for (let i = 0; i < 64; i++) {
    const t = i / 63;
    lut[128 + i] = pack(
      Math.round(30 + t * 225),
      Math.round(40 + t * 210),
      Math.round(20 + t * 90)
    );
  }
  for (let i = 0; i < 64; i++) {
    const v = Math.round((i / 63) * 255);
    lut[192 + i] = pack(v, v, v);
  }
  return lut;
}

const CLUT8 = buildClut8Palette();

/**
 * Evaluate 1D cubic Bezier curve via De Casteljau's algorithm in Q16.16 fixed-point.
 */
function deCasteljau1D(p0, p1, p2, p3, tFp) {
  const invT = FP_ONE - tFp;
  const a0 = fpMul(p0, invT) + fpMul(p1, tFp);
  const a1 = fpMul(p1, invT) + fpMul(p2, tFp);
  const a2 = fpMul(p2, invT) + fpMul(p3, tFp);

  const b0 = fpMul(a0, invT) + fpMul(a1, tFp);
  const b1 = fpMul(a1, invT) + fpMul(a2, tFp);

  return (fpMul(b0, invT) + fpMul(b1, tFp)) | 0;
}

/**
 * Evaluate 4x4 bicubic Bezier patch at (u, v) in Q16.16.
 */
function evalBezierPatch(gridX, gridY, uFp, vFp) {
  const rowX = new Int32Array(4);
  const rowY = new Int32Array(4);
  for (let r = 0; r < 4; r++) {
    const off = r * 4;
    rowX[r] = deCasteljau1D(gridX[off], gridX[off + 1], gridX[off + 2], gridX[off + 3], uFp);
    rowY[r] = deCasteljau1D(gridY[off], gridY[off + 1], gridY[off + 2], gridY[off + 3], uFp);
  }
  return {
    x: deCasteljau1D(rowX[0], rowX[1], rowX[2], rowX[3], vFp),
    y: deCasteljau1D(rowY[0], rowY[1], rowY[2], rowY[3], vFp)
  };
}

export class SplitScreenRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.width = SCREEN_W;
    this.canvas.height = SCREEN_H;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.imageData = this.ctx.createImageData(SCREEN_W, SCREEN_H);
    this.buf32 = new Uint32Array(this.imageData.data.buffer);
    this.idxBuf = new Uint8Array(SCREEN_W * SCREEN_H);

    // 4x4 control grids for The Voice's Bezier manifold
    this.ctrlX = new Int32Array(16);
    this.ctrlY = new Int32Array(16);
  }

  _plotDithered(x, y, bankOffset, intensity64) {
    const ix = x | 0;
    const iy = y | 0;
    if (ix < 0 || ix >= SCREEN_W || iy < 0 || iy >= SCREEN_H) return;
    const threshold = BAYER_4X4[((iy & 3) << 2) | (ix & 3)];
    const val = fpClamp((intensity64 + (threshold >> 1)) | 0, 0, 63);
    const idx = (bankOffset + val) & 255;
    const pos = iy * SCREEN_W + ix;
    if (val >= (this.idxBuf[pos] & 63)) {
      this.idxBuf[pos] = idx;
    }
  }

  _drawLine(x0, y0, x1, y1, bankOffset, intensity) {
    let ix0 = x0 | 0;
    let iy0 = y0 | 0;
    const ix1 = x1 | 0;
    const iy1 = y1 | 0;
    const dx = Math.abs(ix1 - ix0);
    const dy = Math.abs(iy1 - iy0);
    const sx = ix0 < ix1 ? 1 : -1;
    const sy = iy0 < iy1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      this._plotDithered(ix0, iy0, bankOffset, intensity);
      if (ix0 === ix1 && iy0 === iy1) break;
      const e2 = err << 1;
      if (e2 > -dy) {
        err -= dy;
        ix0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        iy0 += sy;
      }
    }
  }

  _renderBackground(tick, dreadRatio) {
    const starShift = (tick >> 2) & 255;
    for (let y = 0; y < SCREEN_H; y++) {
      const rowOff = y * SCREEN_W;
      const bayerRow = (y & 3) << 2;
      for (let x = 0; x < SCREEN_W; x++) {
        if (x === HALF_W - 1 || x === HALF_W) {
          this.idxBuf[rowOff + x] = 175;
          continue;
        }
        const isRight = x > HALF_W;
        const bank = isRight ? 64 : 0;
        const dither = BAYER_4X4[bayerRow | (x & 3)];
        const baseGlow = ((y * 6) / SCREEN_H) | 0;
        const dreadBoost = isRight ? ((dreadRatio * 5) | 0) : 0;
        let idx = bank + fpClamp(baseGlow + dreadBoost + (dither >> 3), 0, 14);

        const hash = (((x + starShift) * 73856093) ^ (y * 19349663)) >>> 0;
        if ((hash & 1023) === 0) {
          idx = 235;
        }
        this.idxBuf[rowOff + x] = idx;
      }
    }
  }

  _renderMurrayLeft(snap) {
    const { tick, coherence, node, absurdity } = snap;
    const cx = 120;
    const cy = 140;
    const cohFloat = Math.max(0.15, fromFixed(coherence) / 100);
    const scatter = (1 - cohFloat) * 46;
    const isSpeaking = node.speaker === 'MURRAY';

    const ringCount = 5;
    for (let r = 0; r < ringCount; r++) {
      const baseRadius = 22 + r * 14;
      const steps = 48;
      let prevX = 0;
      let prevY = 0;
      for (let s = 0; s <= steps; s++) {
        const angle = ((s * 256) / steps + tick * (r % 2 === 0 ? 2 : -2)) & 255;
        const wobblePhase = (angle * 3 + tick * (isSpeaking ? 7 : 3) + r * 31) & 255;
        const wobble = fromFixed(fpSin(wobblePhase)) * (isSpeaking ? 9 : 4);
        const jitter = scatter * fromFixed(fpCos((angle * 5 + tick * 13) & 255));
        const rad = (baseRadius + wobble) * cohFloat + jitter;

        const px = cx + fromFixed(fpCos(angle)) * rad;
        const py = cy + fromFixed(fpSin(angle)) * rad * 0.88;

        if (s > 0) {
          const intensity = isSpeaking ? 58 - r * 5 : 44 - r * 5;
          this._drawLine(prevX, prevY, px, py, 0, intensity);
        }
        prevX = px;
        prevY = py;
      }
    }

    const waveAmp = isSpeaking ? 24 : 9 + (fromFixed(absurdity) / 100) * 8;
    let lastWx = 34;
    let lastWy = cy;
    for (let wx = 34; wx <= 206; wx += 4) {
      const phase = ((wx - 34) * 3 + tick * 9) & 255;
      const harmonic = fromFixed(fpSin(phase)) * 0.65 + fromFixed(fpCos((phase * 2) & 255)) * 0.35;
      const wy = cy + harmonic * waveAmp * cohFloat;
      this._drawLine(lastWx, lastWy, wx, wy, 128, isSpeaking ? 60 : 42);
      lastWx = wx;
      lastWy = wy;
    }

    const bobY = 36 + Math.round(fromFixed(fpSin((tick * 3) & 255)) * 3);
    this._drawLine(24, bobY, 54, bobY, 128, 52);
    this._drawLine(54, bobY, 54, bobY + 36, 128, 52);
    this._drawLine(54, bobY + 36, 24, bobY + 36, 128, 52);
    this._drawLine(24, bobY + 36, 24, bobY, 128, 52);
    for (let line = 0; line < 3; line++) {
      const ly = bobY + 9 + line * 8;
      this._drawLine(29, ly, 49 - line * 3, ly, 0, 56);
    }
  }

  _renderVoiceRight(snap) {
    const { tick, voiceEnergy, node, dread } = snap;
    const cx = 360;
    const cy = 140;
    const isSpeaking = node.speaker === 'VOICE';
    const energy = isSpeaking
      ? Math.max(0.22, fromFixed(voiceEnergy))
      : 0.12 + fromFixed(voiceEnergy) * 0.4;
    const dreadFactor = fromFixed(dread) / 100;

    const geom = node.voiceGeometry || 'TORUS_HARMONIC';
    const spikeMult =
      geom === 'HYPER_SPIKE' || geom === 'OMEGA_MANIFOLD' ? 1.45 :
      geom === 'STELLATED_NEXUS' ? 1.25 : 1.0;

    for (let r = 0; r < 4; r++) {
      const normR = (r - 1.5) / 1.5;
      for (let c = 0; c < 4; c++) {
        const normC = (c - 1.5) / 1.5;
        const idx = r * 4 + c;

        const phaseA = (tick * 3 + r * 43 + c * 61) & 255;
        const phaseB = (tick * 5 - r * 29 + c * 47) & 255;

        const radialPulse = (1 + energy * 0.55 * spikeMult) * (54 + dreadFactor * 14);
        const twistX = fromFixed(fpCos(phaseA)) * (18 + energy * 28 * spikeMult);
        const twistY = fromFixed(fpSin(phaseB)) * (18 + energy * 28 * spikeMult);

        const px = cx + normC * radialPulse + twistX;
        const py = cy + normR * radialPulse * 0.92 + twistY;

        this.ctrlX[idx] = (px * FP_ONE) | 0;
        this.ctrlY[idx] = (py * FP_ONE) | 0;
      }
    }

    const gridSteps = 10;
    const curveSamples = 16;

    for (let g = 0; g <= gridSteps; g++) {
      const fixedParam = Math.round((g / gridSteps) * FP_ONE);
      let prevUx = 0;
      let prevUy = 0;
      let prevVx = 0;
      let prevVy = 0;

      for (let s = 0; s <= curveSamples; s++) {
        const sweepParam = Math.round((s / curveSamples) * FP_ONE);

        const ptU = evalBezierPatch(this.ctrlX, this.ctrlY, sweepParam, fixedParam);
        const ux = fromFixed(ptU.x);
        const uy = fromFixed(ptU.y);
        if (s > 0) {
          this._drawLine(prevUx, prevUy, ux, uy, 64, isSpeaking ? 62 : 46);
        }
        prevUx = ux;
        prevUy = uy;

        const ptV = evalBezierPatch(this.ctrlX, this.ctrlY, fixedParam, sweepParam);
        const vx = fromFixed(ptV.x);
        const vy = fromFixed(ptV.y);
        if (s > 0) {
          this._drawLine(prevVx, prevVy, vx, vy, 128, isSpeaking ? 56 : 38);
        }
        prevVx = vx;
        prevVy = vy;
      }
    }
  }

  render(snap) {
    const dreadRatio = fpClamp(fromFixed(snap.dread) / 100, 0, 1);
    this._renderBackground(snap.tick, dreadRatio);
    this._renderMurrayLeft(snap);
    this._renderVoiceRight(snap);

    for (let i = 0; i < this.idxBuf.length; i++) {
      this.buf32[i] = CLUT8[this.idxBuf[i]];
    }
    this.ctx.putImageData(this.imageData, 0, 0);

    this.ctx.font = 'bold 10px monospace';
    this.ctx.textBaseline = 'top';

    this.ctx.fillStyle = '#5ef2ff';
this.ctx.fillText('MURRAY // COH ' + Math.round(fromFixed(snap.coherence)) + '%', 10, 8);
this.ctx.fillStyle = '#ffd166';
this.ctx.fillText('THE VOICE // ' + snap.node.voiceGeometry, HALF_W + 10, 8);
this.ctx.fillStyle = '#a8dadc';
this.ctx.fillText('LOOP #' + snap.loopCount + ' | ' + snap.bpm + ' BPM', 10, SCREEN_H - 16);
this.ctx.fillStyle = '#ff9f1c';
this.ctx.fillText(
'DREAD ' + Math.round(fromFixed(snap.dread)) + '% | ABSURD ' + Math.round(fromFixed(snap.absurdity)) + '%',
HALF_W + 10,
SCREEN_H - 16
);
}
}
