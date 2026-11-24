import { fnv1aHex } from './core.js';

/**
 * Branching adaptation of Isaac Asimov's "The Last Answer" (1980),
 * filtered through Hitchhiker's Guide & Red Dwarf existential deadpan.
 *
 * Actions:
 *   A = Pedantic Objection (Bureaucracy / Thermodynamics)
 *   D = Attempt Un-Thinking (Scatter EM coherence -> Voice reassembles with 1-Up SFX)
 *   W = Existential Sigh (Shift perspective / absorb cosmic dread)
 *   SPACE = Advance / Paradox Loop
 */
export const STORY_NODES = {
  INTRO: {
    id: 'INTRO',
    act: 1,
    speaker: 'VOICE',
    mood: 'CHEERFUL_OMNIPOTENCE',
    sfx: 'COIN',
    bpm: 132,
    murrayCaption: 'CORONARY THROMBOSIS -> ELECTROMAGNETIC RECONSTITUTION',
    voiceGeometry: 'TORUS_HARMONIC',
    text: 'Good morning, Murray Templeton! Your coronary arteries gave out at 10:42 AM, so I salvaged your electromagnetic pattern. Welcome to eternity. Try not to smudge the cosmos.',
    choices: {
      A: { label: '[A] Object to lack of paperwork', next: 'BUREAUCRACY_1', dreadDelta: -4096, absurdityDelta: 8192 },
      D: { label: '[D] Try to dissipate into void', next: 'UNTHINK_1', dreadDelta: 8192, absurdityDelta: 4096 },
      W: { label: '[W] Sigh electromagnetically', next: 'PURPOSE_1', dreadDelta: 4096, absurdityDelta: 4096 },
      SPACE: { label: '[Space] Ask where the tea urn is', next: 'BUREAUCRACY_1', dreadDelta: 0, absurdityDelta: 6144 }
    }
  },

  BUREAUCRACY_1: {
    id: 'BUREAUCRACY_1',
    act: 1,
    speaker: 'MURRAY',
    mood: 'PEDANTIC_INDIGNATION',
    sfx: 'BUMP',
    bpm: 136,
    murrayCaption: 'REQUESTING FORM 42-B: AFTERLIFE TERMS & TEA BREAKS',
    voiceGeometry: 'OCTAHEDRON_PULSE',
    text: 'Wait a smegging second. I am a theoretical physicist, not an unpaid intern. Where is the reception desk? Where is the tea? And why does the void smell faintly of boiled cabbage and ozone?',
    choices: {
      A: { label: '[A] Demand union representation', next: 'PURPOSE_1', dreadDelta: -2048, absurdityDelta: 10240 },
      D: { label: '[D] Scramble own phase waves', next: 'UNTHINK_1', dreadDelta: 8192, absurdityDelta: 4096 },
      W: { label: '[W] Stare at glowing manifold', next: 'PURPOSE_1', dreadDelta: 4096, absurdityDelta: 2048 },
      SPACE: { label: '[Space] Wait for the Voice to explain', next: 'PURPOSE_1', dreadDelta: 2048, absurdityDelta: 4096 }
    }
  },

  UNTHINK_1: {
    id: 'UNTHINK_1',
    act: 1,
    speaker: 'VOICE',
    mood: 'AMUSED_ADMIN',
    sfx: 'ONE_UP',
    bpm: 140,
    murrayCaption: 'COHERENCE SCATTERED -> FORCIBLY RESTORED (1-UP!)',
    voiceGeometry: 'KLEIN_BLOOM',
    text: 'Ooh, nice try! You scattered three percent of your spin states, so I knitted them right back together. Think of it as an extra life you never asked for and cannot decline.',
    choices: {
      A: { label: '[A] Call that a violation of free will', next: 'PURPOSE_1', dreadDelta: 4096, absurdityDelta: 8192 },
      D: { label: '[D] Try dissipating harder', next: 'UNTHINK_2', dreadDelta: 12288, absurdityDelta: 6144 },
      W: { label: '[W] Accept grim reality of 1-Ups', next: 'PURPOSE_1', dreadDelta: 6144, absurdityDelta: 4096 },
      SPACE: { label: '[Space] Ask why I am even here', next: 'PURPOSE_1', dreadDelta: 2048, absurdityDelta: 4096 }
    }
  },

  UNTHINK_2: {
    id: 'UNTHINK_2',
    act: 2,
    speaker: 'MURRAY',
    mood: 'EXISTENTIAL_PANIC',
    sfx: 'PIPE_WARP',
    bpm: 146,
    murrayCaption: 'ENTROPY REJECTED BY COSMIC GARBAGE COLLECTOR',
    voiceGeometry: 'HYPER_SPIKE',
    text: 'I do not want an extra life! I wanted a quiet nap after seventy-two years of faculty meetings! If I am pure electromagnetic force, I ought to be allowed to disperse like a decent photon!',
    choices: {
      A: { label: '[A] Cite the Second Law of Thermodynamics', next: 'PURPOSE_1', dreadDelta: 2048, absurdityDelta: 10240 },
      D: { label: '[D] Invert polarity again', next: 'PURPOSE_1', dreadDelta: 10240, absurdityDelta: 6144 },
      W: { label: '[W] Sulk like a depressed android', next: 'PURPOSE_1', dreadDelta: 8192, absurdityDelta: 8192 },
      SPACE: { label: '[Space] Listen to the Voice', next: 'PURPOSE_1', dreadDelta: 4096, absurdityDelta: 4096 }
    }
  },

  PURPOSE_1: {
    id: 'PURPOSE_1',
    act: 2,
    speaker: 'VOICE',
    mood: 'COSMIC_REVEAL',
    sfx: 'POWERUP',
    bpm: 150,
    murrayCaption: 'REVELATION: UNIVERSE CREATED SOLELY TO THINK',
    voiceGeometry: 'STELLATED_NEXUS',
    text: 'I created the entire universe, let stars burn and collapse, and sifted trillions of minds just to recruit interesting thinkers like you. Thinking is the only fun left when you are infinite.',
    choices: {
      A: { label: '[A] Ask what happens when we run out of ideas', next: 'THE_CATCH', dreadDelta: 8192, absurdityDelta: 6144 },
      D: { label: '[D] Threaten to think exclusively about beige paint', next: 'BEIGE_PROTEST', dreadDelta: -4096, absurdityDelta: 12288 },
      W: { label: '[W] Feel the crushing weight of forever', next: 'THE_CATCH', dreadDelta: 12288, absurdityDelta: 2048 },
      SPACE: { label: '[Space] Demand to know the catch', next: 'THE_CATCH', dreadDelta: 6144, absurdityDelta: 4096 }
    }
  },

  BEIGE_PROTEST: {
    id: 'BEIGE_PROTEST',
    act: 2,
    speaker: 'MURRAY',
    mood: 'PETTY_DEFIANCE',
    sfx: 'COIN',
    bpm: 154,
    murrayCaption: 'WEAPONIZED BOREDOM: CATALOGING MAGNOLIA EMULSION',
    voiceGeometry: 'TORUS_HARMONIC',
    text: 'Fine. I shall spend the next ten billion years mentally alphabetizing shades of British Rail beige and remembering every cold vindaloo I ever ate. Enjoy the show, Almighty.',
    choices: {
      A: { label: '[A] Continue reciting beige hex codes', next: 'THE_CATCH', dreadDelta: -2048, absurdityDelta: 12288 },
      D: { label: '[D] Attempt self-erasure mid-recital', next: 'THE_CATCH', dreadDelta: 8192, absurdityDelta: 6144 },
      W: { label: '[W] Pause for dramatic effect', next: 'THE_CATCH', dreadDelta: 4096, absurdityDelta: 6144 },
      SPACE: { label: '[Space] Hear the Voice chuckle', next: 'THE_CATCH', dreadDelta: 4096, absurdityDelta: 8192 }
    }
  },

  THE_CATCH: {
    id: 'THE_CATCH',
    act: 3,
    speaker: 'VOICE',
    mood: 'BRIGHT_HORROR',
    sfx: 'STAR_FANFARE',
    bpm: 162,
    murrayCaption: 'THE LAST ANSWER: FIND A WAY TO DESTROY THE VOICE',
    voiceGeometry: 'OMEGA_MANIFOLD',
    text: 'Here is your actual assignment, Murray: figure out how to destroy me. I cannot end myself, and eternity without an exit is dreadfully dull. Surprise me—you have forever!',
    choices: {
      A: { label: '[A] Point out the cruel irony of the assignment', next: 'THE_LOOP', dreadDelta: 10240, absurdityDelta: 10240 },
      D: { label: '[D] Realize you cannot even destroy yourself', next: 'THE_LOOP', dreadDelta: 14336, absurdityDelta: 6144 },
      W: { label: '[W] Laugh bitterly into the void', next: 'THE_LOOP', dreadDelta: 8192, absurdityDelta: 14336 },
      SPACE: { label: '[Space] Accept the eternal paradox', next: 'THE_LOOP', dreadDelta: 10240, absurdityDelta: 12288 }
    }
  },

  THE_LOOP: {
    id: 'THE_LOOP',
    act: 3,
    speaker: 'MURRAY',
    mood: 'ABSURDIST_EPIPHANY',
    sfx: 'STAGE_CLEAR',
    bpm: 172,
    murrayCaption: 'ETERNITY COMMENCED // NO EXIT // DON’T PANIC',
    voiceGeometry: 'INFINITE_LISSAJOUS',
    text: 'Every clever plan I invent to snuff you out will only entertain you enough to keep me switched on. Brilliant. Truly smegging brilliant. Put the kettle on—eternity just started.',
    choices: {
      A: { label: '[A] Begin Iteration #2 with fresh pedantry', next: 'INTRO', dreadDelta: 0, absurdityDelta: 4096 },
      D: { label: '[D] Try dissipating one more time for luck', next: 'UNTHINK_1', dreadDelta: 4096, absurdityDelta: 4096 },
      W: { label: '[W] Contemplate the infinite loop', next: 'INTRO', dreadDelta: 2048, absurdityDelta: 2048 },
      SPACE: { label: '[Space] Loop eternity from the top', next: 'INTRO', dreadDelta: 0, absurdityDelta: 4096 }
    }
  }
};

/**
 * Generates deterministic 1:1 Piper TTS cue metadata for every story node.
 */
export function buildAudioManifest(model = 'en_GB-alan-medium') {
  const cues = {};
  for (const [nodeId, node] of Object.entries(STORY_NODES)) {
    const hash = fnv1aHex(node.text);
    cues[nodeId] = {
      nodeId,
      speaker: node.speaker,
      hash,
      file: `audio/${hash}.wav`,
      model,
      text: node.text
    };
  }
  return {
    version: 1,
    defaultModel: model,
    cues
  };
}
