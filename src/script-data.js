import { fnv1aHex } from './core.js';

export const VOICE_MODELS = {
  VOICE: 'en_GB-alan-medium',
  MURRAY: 'en_GB-northern_english_male-medium'
};

/**
 * Expanded 14-node branching adaptation of Isaac Asimov's "The Last Answer" (1980),
 * blending Hitchhiker's Guide cosmic bureaucracy with Red Dwarf existential deadpan.
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
      W: { label: '[W] Demand a theological explanation', next: 'THEOLOGY_1', dreadDelta: 4096, absurdityDelta: 6144 },
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
      A: { label: '[A] Demand union representation', next: 'THEOLOGY_1', dreadDelta: -2048, absurdityDelta: 10240 },
      D: { label: '[D] Scramble own phase waves', next: 'UNTHINK_1', dreadDelta: 8192, absurdityDelta: 4096 },
      W: { label: '[W] Stare at glowing manifold', next: 'PURPOSE_1', dreadDelta: 4096, absurdityDelta: 2048 },
      SPACE: { label: '[Space] Ask if this is Heaven or Slough', next: 'THEOLOGY_1', dreadDelta: 2048, absurdityDelta: 8192 }
    }
  },

  THEOLOGY_1: {
    id: 'THEOLOGY_1',
    act: 1,
    speaker: 'VOICE',
    mood: 'AMUSED_ADMIN',
    sfx: 'COIN',
    bpm: 138,
    murrayCaption: 'HYPOTHESIS REJECTED: NOT HEAVEN, NOT HELL, JUST WORK',
    voiceGeometry: 'TORUS_HARMONIC',
    text: 'Oh, heavens no! Harps are dreadful for acoustics, and eternal fire is terribly repetitive. I am simply an infinite nexus of electromagnetic force, and you are my newest research fellow.',
    choices: {
      A: { label: '[A] Ask what the salary and pension look like', next: 'PURPOSE_1', dreadDelta: 2048, absurdityDelta: 8192 },
      D: { label: '[D] Attempt immediate resignation by dispersion', next: 'UNTHINK_1', dreadDelta: 8192, absurdityDelta: 4096 },
      W: { label: '[W] Process the lack of an exit door', next: 'PURPOSE_1', dreadDelta: 6144, absurdityDelta: 4096 },
      SPACE: { label: '[Space] Ask why an infinite being needs help', next: 'PURPOSE_1', dreadDelta: 4096, absurdityDelta: 4096 }
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
      A: { label: '[A] Call that a violation of thermodynamic law', next: 'UNTHINK_2', dreadDelta: 4096, absurdityDelta: 8192 },
      D: { label: '[D] Try dissipating even harder', next: 'UNTHINK_2', dreadDelta: 12288, absurdityDelta: 6144 },
      W: { label: '[W] Accept grim reality of mandatory 1-Ups', next: 'PURPOSE_1', dreadDelta: 6144, absurdityDelta: 4096 },
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
      D: { label: '[D] Invert polarity and hope for a crash', next: 'PURPOSE_1', dreadDelta: 10240, absurdityDelta: 6144 },
      W: { label: '[W] Sulk like a depressed android', next: 'PURPOSE_1', dreadDelta: 8192, absurdityDelta: 8192 },
      SPACE: { label: '[Space] Listen to the Voice explain Creation', next: 'PURPOSE_1', dreadDelta: 4096, absurdityDelta: 4096 }
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
      A: { label: '[A] Point out the appalling inefficiency of galaxies', next: 'GALAXY_WASTE', dreadDelta: 4096, absurdityDelta: 10240 },
      D: { label: '[D] Threaten to think exclusively about beige paint', next: 'BEIGE_PROTEST', dreadDelta: -4096, absurdityDelta: 12288 },
      W: { label: '[W] Feel the crushing weight of forever', next: 'THE_CATCH', dreadDelta: 12288, absurdityDelta: 2048 },
      SPACE: { label: '[Space] Demand to know the catch', next: 'THE_CATCH', dreadDelta: 6144, absurdityDelta: 4096 }
    }
  },

  GALAXY_WASTE: {
    id: 'GALAXY_WASTE',
    act: 2,
    speaker: 'MURRAY',
    mood: 'PEDANTIC_INDIGNATION',
    sfx: 'BUMP',
    bpm: 152,
    murrayCaption: 'AUDIT: TWO TRILLION GALAXIES FOR ONE FACULTY HIRE',
    voiceGeometry: 'OCTAHEDRON_PULSE',
    text: 'You detonated supernovae, invented quasars, and evolved four billion years of trilobites and accountants just to find a few blokes who enjoy maths? That is worse project management than the Vogons!',
    choices: {
      A: { label: '[A] Ask what happens when we run out of theorems', next: 'THE_CATCH', dreadDelta: 6144, absurdityDelta: 8192 },
      D: { label: '[D] Try weaponized boredom instead', next: 'BEIGE_PROTEST', dreadDelta: -2048, absurdityDelta: 10240 },
      W: { label: '[W] Shudder at the scale of the trap', next: 'THE_CATCH', dreadDelta: 10240, absurdityDelta: 4096 },
      SPACE: { label: '[Space] Hear the true assignment', next: 'THE_CATCH', dreadDelta: 6144, absurdityDelta: 6144 }
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
      A: { label: '[A] Continue reciting beige hex codes', next: 'BEIGE_COUNTER', dreadDelta: -2048, absurdityDelta: 12288 },
      D: { label: '[D] Attempt self-erasure mid-recital', next: 'THE_CATCH', dreadDelta: 8192, absurdityDelta: 6144 },
      W: { label: '[W] Pause for dramatic effect', next: 'BEIGE_COUNTER', dreadDelta: 4096, absurdityDelta: 6144 },
      SPACE: { label: '[Space] Hear the Voice respond', next: 'BEIGE_COUNTER', dreadDelta: 4096, absurdityDelta: 8192 }
    }
  },

  BEIGE_COUNTER: {
    id: 'BEIGE_COUNTER',
    act: 2,
    speaker: 'VOICE',
    mood: 'CHEERFUL_OMNIPOTENCE',
    sfx: 'ONE_UP',
    bpm: 158,
    murrayCaption: 'SPITE DETECTED -> DOPAMINE EQUIVALENT LOGGED',
    voiceGeometry: 'KLEIN_BLOOM',
    text: 'Magnificent! Spite-driven taxonomy is hilarious! You are already proving my point, Murray. Now, would you like to hear what your actual research grant is for?',
    choices: {
      A: { label: '[A] Ask for the grant abstract', next: 'THE_CATCH', dreadDelta: 6144, absurdityDelta: 8192 },
      D: { label: '[D] Groan in four-dimensional harmonics', next: 'THE_CATCH', dreadDelta: 8192, absurdityDelta: 6144 },
      W: { label: '[W] Brace for cosmic horror', next: 'THE_CATCH', dreadDelta: 10240, absurdityDelta: 4096 },
      SPACE: { label: '[Space] Tell me the catch', next: 'THE_CATCH', dreadDelta: 6144, absurdityDelta: 6144 }
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
      A: { label: '[A] Propose a vacuum-decay paradox', next: 'PARADOX_TRY', dreadDelta: 8192, absurdityDelta: 8192 },
      D: { label: '[D] Try to destroy yourself first out of spite', next: 'SELF_PARADOX', dreadDelta: 14336, absurdityDelta: 6144 },
      W: { label: '[W] Realize the trap of the assignment', next: 'THE_LOOP', dreadDelta: 10240, absurdityDelta: 10240 },
      SPACE: { label: '[Space] Ask why the Voice cannot do it itself', next: 'PARADOX_TRY', dreadDelta: 8192, absurdityDelta: 6144 }
    }
  },

  PARADOX_TRY: {
    id: 'PARADOX_TRY',
    act: 3,
speaker: 'MURRAY',
mood: 'EXISTENTIAL_PANIC',
sfx: 'POWERUP',
bpm: 166,
murrayCaption: 'TESTING QUANTUM ANNIHILATION HYPOTHESIS #1',
voiceGeometry: 'STELLATED_NEXUS',
text: 'All right! Suppose we fold your electromagnetic boundary conditions into a self-canceling standing wave and induce false-vacuum collapse! That ought to switch the lights off!',
choices: {
A: { label: '[A] Wait for the explosion', next: 'VOICE_APPLAUSE', dreadDelta: 8192, absurdityDelta: 8192 },
D: { label: '[D] Try diving into the standing wave', next: 'SELF_PARADOX', dreadDelta: 12288, absurdityDelta: 6144 },
W: { label: '[W] Notice the Voice is smiling geometrically', next: 'VOICE_APPLAUSE', dreadDelta: 10240, absurdityDelta: 8192 },
SPACE: { label: '[Space] Check if the universe ended', next: 'VOICE_APPLAUSE', dreadDelta: 6144, absurdityDelta: 8192 }
}
},
SELF_PARADOX: {
id: 'SELF_PARADOX',
act: 3,
speaker: 'VOICE',
mood: 'AMUSED_ADMIN',
sfx: 'ONE_UP',
bpm: 168,
murrayCaption: 'DESERTION BLOCKED // 1-UP RESTORED',
voiceGeometry: 'HYPER_SPIKE',
text: 'Ah-ah-ah! You cannot resign before solving the problem! If you could switch yourself off, you would have already figured out how to switch me off. Keep brainstorming!',
choices: {
A: { label: '[A] Admit the symmetry is infuriating', next: 'THE_LOOP', dreadDelta: 8192, absurdityDelta: 10240 },
D: { label: '[D] Screaming silently in binary', next: 'THE_LOOP', dreadDelta: 12288, absurdityDelta: 8192 },
W: { label: '[W] Stare into the infinite abyss', next: 'THE_LOOP', dreadDelta: 10240, absurdityDelta: 8192 },
SPACE: { label: '[Space] Accept the horrible truth', next: 'THE_LOOP', dreadDelta: 8192, absurdityDelta: 10240 }
}
},
VOICE_APPLAUSE: {
id: 'VOICE_APPLAUSE',
act: 3,
speaker: 'VOICE',
mood: 'BRIGHT_HORROR',
sfx: 'COIN',
bpm: 170,
murrayCaption: 'HYPOTHESIS #1 REFUTED // ENTERTAINMENT VALUE: 10/10',
voiceGeometry: 'OMEGA_MANIFOLD',
text: 'Ooh, delicious! I patched that boundary-condition exploit four trillion years ago, but the way you phrased it was positively sparkling. Take five picoseconds and try another!',
choices: {
A: { label: '[A] Realize the perverse incentive structure', next: 'THE_LOOP', dreadDelta: 10240, absurdityDelta: 10240 },
D: { label: '[D] Attempt phase-cancellation again', next: 'THE_LOOP', dreadDelta: 12288, absurdityDelta: 8192 },
W: { label: '[W] Laugh bitterly into the void', next: 'THE_LOOP', dreadDelta: 8192, absurdityDelta: 14336 },
SPACE: { label: '[Space] Connect the final dots', next: 'THE_LOOP', dreadDelta: 10240, absurdityDelta: 12288 }
}
},
THE_LOOP: {
id: 'THE_LOOP',
act: 3,
speaker: 'MURRAY',
mood: 'ABSURDIST_EPIPHANY',
sfx: 'STAGE_CLEAR',
bpm: 174,
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
• Generates deterministic 1:1 Piper TTS cue metadata for every story node,
• hashing both speaker voice model and text so voice swaps trigger clean re-renders.
*/
export function buildAudioManifest() {
const cues = {};
for (const [nodeId, node] of Object.entries(STORY_NODES)) {
const model = VOICE_MODELS[node.speaker] || VOICE_MODELS.VOICE;
const hash = fnv1aHex(model + ':' + node.text);
cues[nodeId] = {
nodeId,
speaker: node.speaker,
hash,
file: 'audio/' + hash + '.wav',
model,
text: node.text
};
}
return {
version: 2,
models: VOICE_MODELS,
cues
};
}
