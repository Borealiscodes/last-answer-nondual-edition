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

test('all 22 story nodes have valid choice targets and zero dead ends', () => {
  const ids = Object.keys(STORY_NODES);
  assert.equal(ids.length, 22);

  for (const [id, node] of Object.entries(STORY_NODES)) {
    assert.ok(['VOICE', 'MURRAY'].includes(node.speaker), id + ' must have valid speaker');
    for (const key of ['A', 'D', 'W', 'SPACE']) {
      const choice = node.choices[key];
      assert.ok(choice, id + ' missing choice ' + key);
      assert.ok(STORY_NODES[choice.next], id + ' choice ' + key + ' points to unknown node ' + choice.next);
    }
  }
});

test('attempting to un-think (D) scatters coherence and springs back to 100%', () => {
  const kernel = createStoryKernel();
  kernel.dispatch('D'); // INTRO -> M_TRY_SCATTER
  const scattered = kernel.getSnapshot().coherence;
  assert.ok(scattered < FP_ONE * 50, 'coherence should scatter immediately on D');

  for (let i = 0; i < 60; i++) {
    kernel.step(0);
  }
  const restored = kernel.getSnapshot().coherence;
  assert.equal(restored, FP_ONE * 100, 'Voice must forcibly restore Murray coherence');
});

test('completing the coherent 4-act arc increments eternity loopCount', () => {
  const kernel = createStoryKernel();
  assert.equal(kernel.getSnapshot().loopCount, 1);

  kernel.dispatch('A');     // INTRO -> M_TEA_DEMAND
  kernel.dispatch('SPACE'); // M_TEA_DEMAND -> V_NO_CABBAGE
  kernel.dispatch('SPACE'); // V_NO_CABBAGE -> M_WHO_ARE_YOU
  kernel.dispatch('SPACE'); // M_WHO_ARE_YOU -> V_WHY_THINK
  kernel.dispatch('W');     // V_WHY_THINK -> M_OUT_OF_IDEAS
  kernel.dispatch('SPACE'); // M_OUT_OF_IDEAS -> V_THE_CATCH
  kernel.dispatch('W');     // V_THE_CATCH -> M_CRUEL_CATCH
  kernel.dispatch('SPACE'); // M_CRUEL_CATCH -> V_CONFIRM_TRAP
  kernel.dispatch('SPACE'); // V_CONFIRM_TRAP -> THE_LOOP
  assert.equal(kernel.getSnapshot().node.id, 'THE_LOOP');

  kernel.dispatch('SPACE'); // THE_LOOP -> INTRO (Loop 2)
  assert.equal(kernel.getSnapshot().node.id, 'INTRO');
  assert.equal(kernel.getSnapshot().loopCount, 2);
  assert.ok(kernel.getSnapshot().bpm > STORY_NODES.INTRO.bpm);
});

test('audio/manifest.json has 1:1 dual-voice FNV-1a hash parity with all 22 story nodes', () => {
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
