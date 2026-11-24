#!/usr/bin/env node
/**
 * Offline / CI Piper TTS batch generator.
 * Reads `audio/manifest.json` and renders `audio/<hash>.wav` for every cue.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const MANIFEST_PATH = path.resolve('audio/manifest.json');
const PIPER_BIN = process.env.PIPER_BIN || 'piper';
const PIPER_MODEL = process.env.PIPER_MODEL || 'en_GB-alan-medium.onnx';

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('Missing audio/manifest.json.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const cues = Object.values(manifest.cues || {});

const probe = spawnSync(PIPER_BIN, ['--help'], { encoding: 'utf8' });
if (probe.error) {
  console.warn(`[piper-build] '${PIPER_BIN}' not found in PATH. Skipping offline WAV render.`);
  process.exit(0);
}

if (!fs.existsSync(PIPER_MODEL)) {
  console.warn(`[piper-build] Model '${PIPER_MODEL}' not found.`);
  process.exit(0);
}

let rendered = 0;
for (const cue of cues) {
  const outPath = path.resolve(cue.file);
  const lengthScale = cue.speaker === 'VOICE' ? '1.04' : '0.94';
  const res = spawnSync(
    PIPER_BIN,
    ['--model', PIPER_MODEL, '--length_scale', lengthScale, '--output_file', outPath],
    { input: cue.text + '\n', encoding: 'utf8' }
  );

  if (res.status === 0 && fs.existsSync(outPath)) {
    rendered += 1;
    console.log(`[ok] ${cue.nodeId} -> ${cue.file}`);
  } else {
    console.error(`[err] Failed rendering ${cue.nodeId}:`, res.stderr || res.error);
  }
}

console.log(`Rendered ${rendered}/${cues.length} Piper TTS cues.`);
