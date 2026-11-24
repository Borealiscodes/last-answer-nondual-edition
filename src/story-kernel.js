import {
  FP_ONE,
  FP_HALF,
  fpClamp,
  fpMul,
  fpSin,
  createRng,
  fnv1aHex
} from './core.js';
import { STORY_NODES, VOICE_MODELS } from './script-data.js';

export const MAX_GAUGE = FP_ONE * 100;

export function createStoryKernel(seed = 0x19801980) {
  const rng = createRng(seed);

  const state = {
    tick: 0,
    loopCount: 1,
    nodeId: 'INTRO',
    dread: FP_ONE * 15,
    absurdity: FP_ONE * 25,
    coherence: FP_ONE * 100,
    voiceEnergy: FP_HALF,
    lastAction: null,
    lastSfx: STORY_NODES.INTRO.sfx,
    history: ['INTRO']
  };

  function getCurrentNode() {
    return STORY_NODES[state.nodeId] || STORY_NODES.INTRO;
  }

  function getCueInfo() {
    const node = getCurrentNode();
    const model = VOICE_MODELS[node.speaker] || VOICE_MODELS.VOICE;
    const hash = fnv1aHex(model + ':' + node.text);
    return {
      nodeId: node.id,
      speaker: node.speaker,
      model,
      hash,
      file: 'audio/' + hash + '.wav',
      text: node.text
    };
  }

  function dispatch(action) {
    const key = String(action || '').toUpperCase();
    const node = getCurrentNode();
    const choice = node.choices[key];
    if (!choice) return false;

    const nextNode = STORY_NODES[choice.next] || STORY_NODES.INTRO;

    if (node.id === 'THE_LOOP' && choice.next === 'INTRO') {
      state.loopCount += 1;
    }

    const loopBonus = (state.loopCount - 1) * 1024;
    state.dread = fpClamp(state.dread + choice.dreadDelta + loopBonus, 0, MAX_GAUGE);
    state.absurdity = fpClamp(state.absurdity + choice.absurdityDelta + loopBonus, 0, MAX_GAUGE);

    if (key === 'D') {
      state.coherence = FP_ONE * 28;
    } else {
      state.coherence = fpClamp(state.coherence + FP_ONE * 12, 0, MAX_GAUGE);
    }

    state.nodeId = nextNode.id;
    state.lastAction = key;
    state.lastSfx = nextNode.sfx;
    state.history.push(nextNode.id);
    if (state.history.length > 32) {
      state.history.shift();
    }

    return true;
  }

  function step(externalVoiceEnergy = 0) {
    state.tick += 1;

    const targetEnergy = fpClamp(externalVoiceEnergy | 0, 0, FP_ONE);
    state.voiceEnergy = (state.voiceEnergy + ((targetEnergy - state.voiceEnergy) >> 2)) | 0;

    const targetCoherence = FP_ONE * 100;
    if (state.coherence < targetCoherence) {
      const recovery = FP_ONE * 2 + ((rng() & 0x7fff) >> 2);
      state.coherence = fpClamp(state.coherence + recovery, 0, targetCoherence);
    }

    const wave = fpSin((state.tick * 2) & 255);
    const microDrift = fpMul(wave, 32);
    state.dread = fpClamp(state.dread + microDrift, 0, MAX_GAUGE);
  }

  function getSnapshot() {
    const node = getCurrentNode();
    return {
      tick: state.tick,
      loopCount: state.loopCount,
      node,
      cue: getCueInfo(),
      dread: state.dread,
      absurdity: state.absurdity,
      coherence: state.coherence,
      voiceEnergy: state.voiceEnergy,
      lastAction: state.lastAction,
      lastSfx: state.lastSfx,
      bpm: Math.min(210, node.bpm + (state.loopCount - 1) * 6)
    };
  }

  return {
    dispatch,
    step,
    getSnapshot,
    getCurrentNode,
    getCueInfo
  };
}
