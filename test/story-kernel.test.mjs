import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { FP_ONE, fnv1aHex } from '../src/core.js';
import { STORY_NODES, VOICE_MODELS, buildAudioManifest } from '../src/script-data.js';
import { createStoryKernel } from '../src/story-kernel.js';

test('deterministic fixed-timestep replay produces identical state', () => {
  const a = createStoryKernel(0x42424242);
  const b = createStoryKernel(0x42424242);

  const actions = ['A', 'D', 'SPACE', 'D', 'W', 'SPACE'];
  for (const act of actions) {
    assert.equal(a.dispatch(act), true);
    assert.equal(b.dispatch(act), true);
    for (let i = 0; i < 15; i++) {
      a.step(FP_ONE >> 1);
      b.step(FP_ONE >> 1);
    }
  }

  assert.deepEqual(a.getSnapshot(), b.getSnapshot());
});

test('attempting to un-think (D) scatters coherence and springs back to 100%', () => {
  const kernel = createStoryKernel();
  kernel.dispatch('D');
  const scattered = kernel.getSnapshot().coherence;
  assert.ok(scattered < FP_ONE * 50, 'coherence should scatter immediately on D');

  for (let i = 0; i < 60; i++) {
    kernel.step(0);
  }
  const restored = kernel.getSnapshot().coherence;
  assert.equal(restored, FP_ONE * 100, 'Voice must forcibly restore Murray coherence');
});

test('completing the expanded narrative arc increments eternity loopCount', () => {
  const kernel = createStoryKernel();
  assert.equal(kernel.getSnapshot().loopCount, 1);

  kernel.dispatch('SPACE'); // INTRO -> BUREAUCRACY_1
  kernel.dispatch('SPACE'); // BUREAUCRACY_1 -> THEOLOGY_1
  kernel.dispatch('SPACE'); // THEOLOGY_1 -> PURPOSE_1
  kernel.dispatch('SPACE'); // PURPOSE_1 -> THE_CATCH
  kernel.dispatch('SPACE'); // THE_CATCH -> PARADOX_TRY
  kernel.dispatch('SPACE'); // PARADOX_TRY -> VOICE_APPLAUSE
  kernel.dispatch('SPACE'); // VOICE_APPLAUSE -> THE_LOOP
  assert.equal(kernel.getSnapshot().node.id, 'THE_LOOP');

  kernel.dispatch('SPACE'); // THE_LOOP -> INTRO (Loop 2)
  assert.equal(kernel.getSnapshot().node.id, 'INTRO');
  assert.equal(kernel.getSnapshot().loopCount, 2);
  assert.ok(kernel.getSnapshot().bpm > STORY_NODES.INTRO.bpm);
});

test('audio/manifest.json has 1:1 dual-voice FNV-1a hash parity with every story node', () => {
  const diskManifest = JSON.parse(fs.readFileSync('audio/manifest.json', 'utf8'));
  const generated = buildAudioManifest();

  assert.deepEqual(diskManifest, generated);
  const modelsSeen = new Set();
  for (const [id, node] of Object.entries(STORY_NODES)) {
    const expectedModel = VOICE_MODELS[node.speaker];
    const expectedHash = fnv1aHex(expectedModel + ':' + node.text);
    assert.equal(diskManifest.cues[id].model, expectedModel);
    assert.equal(diskManifest.cues[id].hash, expectedHash);
    assert.equal(diskManifest.cues[id].file, 'audio/' + expectedHash + '.wav');
    modelsSeen.add(expectedModel);
  }
  assert.equal(modelsSeen.size, 2, 'manifest should use two distinct Piper voice models');
});
