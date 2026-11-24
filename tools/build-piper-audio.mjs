#!/usr/bin/env node
/**
 * Multi-voice Piper TTS batch generator.
 * Reads `audio/manifest.json` and renders `audio/<hash>.wav` using each cue's assigned voice model.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const MANIFEST_PATH = path.resolve('audio/manifest.json');
const PIPER_BIN = process.env.PIPER_BIN || 'piper';
const PIPER_MODEL_DIR = process.env.PIPER_MODEL_DIR || '.cache/piper';

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('Missing audio/manifest.json.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const cues = Object.values(manifest.cues || {});

const probe = spawnSync(PIPER_BIN, ['--help'], { encoding: 'utf8' });
if (probe.error) {
  console.warn('[piper-build] piper binary not found in PATH. Skipping offline WAV render.');
  process.exit(0);
}

let rendered = 0;
for (const cue of cues) {
  const outPath = path.resolve(cue.file);
  if (fs.existsSync(outPath)) {
    rendered += 1;
    console.log('[cached] ' + cue.nodeId + ' -> ' + cue.file);
    continue;
  }

  const modelPath = path.resolve(PIPER_MODEL_DIR, cue.model + '.onnx');
  if (!fs.existsSync(modelPath)) {
    console.error('[err] Missing model file: ' + modelPath);
    continue;
  }

  const lengthScale = cue.speaker === 'VOICE' ? '1.03' : '0.94';
  const res = spawnSync(
    PIPER_BIN,
    ['--model', modelPath, '--length_scale', lengthScale, '--output_file', outPath],
    { input: cue.text + '\n', encoding: 'utf8' }
  );

  if (res.status === 0 && fs.existsSync(outPath)) {
    rendered += 1;
    console.log('[ok] ' + cue.nodeId + ' (' + cue.model + ') -> ' + cue.file);
  } else {
    console.error('[err] Failed rendering ' + cue.nodeId + ':', res.stderr || res.error);
  }
}

console.log('Rendered ' + rendered + '/' + cues.length + ' Piper TTS cues.');
