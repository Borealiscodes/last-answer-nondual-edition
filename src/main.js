import { createStoryKernel } from './story-kernel.js';
import { SplitScreenRenderer } from './split-renderer.js';
import { ChiptuneSynth } from './chiptune-synth.js';
import { PiperVoiceBridge } from './piper-bridge.js';

const canvas = document.getElementById('split-canvas');
const btnInit = document.getElementById('btn-init');
const btnMute = document.getElementById('btn-mute');
const murrayCaptionEl = document.getElementById('murray-caption');
const audioStatusEl = document.getElementById('audio-status');
const speakerTagEl = document.getElementById('speaker-tag');
const actTagEl = document.getElementById('act-tag');
const dialogueTextEl = document.getElementById('dialogue-text');

const actionButtons = {
  A: document.getElementById('btn-A'),
  D: document.getElementById('btn-D'),
  W: document.getElementById('btn-W'),
  SPACE: document.getElementById('btn-SPACE')
};

const kernel = createStoryKernel(0x19801980);
const renderer = new SplitScreenRenderer(canvas);
const synth = new ChiptuneSynth();
const piper = new PiperVoiceBridge();

let started = false;

function syncHud() {
  const snap = kernel.getSnapshot();
  const { node } = snap;

  murrayCaptionEl.textContent = node.murrayCaption;
  speakerTagEl.textContent = node.speaker === 'VOICE' ? 'THE VOICE' : 'MURRAY TEMPLETON';
  speakerTagEl.className = 'speaker-tag ' + (node.speaker === 'VOICE' ? 'voice' : 'murray');
  actTagEl.textContent = 'ACT ' + node.act + ' // LOOP #' + snap.loopCount;
  dialogueTextEl.textContent = node.text;

  for (const key of ['A', 'D', 'W', 'SPACE']) {
    const choice = node.choices[key];
    if (choice && actionButtons[key]) {
      actionButtons[key].textContent = choice.label;
    }
  }
}

async function triggerCurrentNodeAudio() {
  const snap = kernel.getSnapshot();
  synth.setBpm(snap.bpm);
  synth.playSfx(snap.lastSfx);

  const res = await piper.speakCue(snap.cue, synth.ctx);
  if (res && res.mode === 'piper-wav') {
    audioStatusEl.textContent = 'PIPER WAV: ' + snap.cue.hash + '.wav';
  } else if (res && res.mode === 'fallback-synth') {
    audioStatusEl.textContent = 'SYNTH VOICE (PUSH TO CI FOR WAV)';
  } else {
    audioStatusEl.textContent = 'AUDIO: MUTED';
  }
}

function ensureStarted() {
  if (started) return;
  started = true;
  const ctx = synth.ensureContext();
  piper.ensureContext(ctx);
  synth.start(ctx);
  btnInit.textContent = 'Eternity Active';
  syncHud();
  triggerCurrentNodeAudio();
}

function handleAction(action) {
  if (!started) {
    ensureStarted();
    return;
  }
  const changed = kernel.dispatch(action);
  if (changed) {
    syncHud();
    triggerCurrentNodeAudio();
  }
}

function handleMuteToggle() {
  const muted = synth.toggleMute();
  piper.setMuted(muted);
  btnMute.textContent = muted ? 'Unmute [M]' : 'Mute [M]';
  btnMute.setAttribute('aria-pressed', String(muted));
  audioStatusEl.textContent = muted ? 'AUDIO: MUTED' : 'AUDIO: ACTIVE';
}

btnInit.addEventListener('click', () => {
  if (!started) {
    ensureStarted();
  } else {
    triggerCurrentNodeAudio();
  }
});

btnMute.addEventListener('click', handleMuteToggle);

for (const [key, btn] of Object.entries(actionButtons)) {
  btn.addEventListener('click', () => handleAction(key));
}

window.addEventListener('keydown', (ev) => {
  if (ev.repeat) return;
  const k = ev.key.toUpperCase();
  if (k === 'M') {
    handleMuteToggle();
    return;
  }
  if (k === 'A' || k === 'D' || k === 'W') {
    ev.preventDefault();
    handleAction(k);
    return;
  }
  if (ev.code === 'Space') {
    ev.preventDefault();
    handleAction('SPACE');
  }
});

// Fixed 60 Hz deterministic simulation loop
const STEP_MS = 1000 / 60;
let lastTime = performance.now();
let accumulator = 0;

function frame(now) {
  const dt = Math.min(100, now - lastTime);
  lastTime = now;
  accumulator += dt;

  while (accumulator >= STEP_MS) {
    const energy = piper.getVoiceEnergy();
    kernel.step(energy);
    accumulator -= STEP_MS;
  }

  renderer.render(kernel.getSnapshot());
  requestAnimationFrame(frame);
}

syncHud();
requestAnimationFrame(frame);
