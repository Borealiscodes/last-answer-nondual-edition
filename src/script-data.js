import { fnv1aHex } from './core.js';

export const VOICE_MODELS = {
  VOICE: 'en_GB-alan-medium',
  MURRAY: 'en_GB-northern_english_male-medium'
};

/**
 * 22-node coherent call-and-response adaptation of Isaac Asimov's "The Last Answer" (1980),
 * structured as a true alternating dialogue between Murray Templeton and The Voice.
 */
export const STORY_NODES = {
  // ================= ACT I: WAKING UP DEAD =================
  INTRO: {
    id: 'INTRO',
    act: 1,
    speaker: 'VOICE',
    mood: 'CHEERFUL_OMNIPOTENCE',
    sfx: 'COIN',
    bpm: 132,
    murrayCaption: '10:42 AM // CORONARY ARREST -> ELECTROMAGNETIC RECONSTITUTION',
    voiceGeometry: 'TORUS_HARMONIC',
    text: 'Good morning, Murray Templeton! Your heart stopped at 10:42 AM, so I salvaged your electromagnetic pattern before it could disperse. Welcome to eternity!',
    choices: {
      A: { label: '[A] Demand afterlife paperwork & tea', next: 'M_TEA_DEMAND', dreadDelta: -2048, absurdityDelta: 8192 },
      D: { label: '[D] Try to scatter your own energy', next: 'M_TRY_SCATTER', dreadDelta: 8192, absurdityDelta: 4096 },
      W: { label: '[W] Ask if this is Heaven or Hell', next: 'M_ASK_HEAVEN', dreadDelta: 4096, absurdityDelta: 4096 },
      SPACE: { label: '[Space] Ask who is speaking', next: 'M_WHO_ARE_YOU', dreadDelta: 2048, absurdityDelta: 4096 }
    }
  },

  M_TEA_DEMAND: {
    id: 'M_TEA_DEMAND',
    act: 1,
    speaker: 'MURRAY',
    mood: 'PEDANTIC_INDIGNATION',
    sfx: 'BUMP',
    bpm: 134,
    murrayCaption: 'FILING COMPLAINT: NO RECEPTION DESK, NO KETTLE',
    voiceGeometry: 'OCTAHEDRON_PULSE',
    text: 'Hang on a smegging minute! If I am dead, where is the reception desk? Where is the tea urn? And why does the endless void smell faintly of boiled cabbage and ozone?',
    choices: {
      A: { label: '[A] Insist on proper onboarding', next: 'V_NO_CABBAGE', dreadDelta: -2048, absurdityDelta: 8192 },
      D: { label: '[D] Refuse to stay without a break room', next: 'M_TRY_SCATTER', dreadDelta: 6144, absurdityDelta: 6144 },
      W: { label: '[W] Sigh at the glowing shape', next: 'V_NO_CABBAGE', dreadDelta: 2048, absurdityDelta: 4096 },
      SPACE: { label: '[Space] Wait for an answer', next: 'V_NO_CABBAGE', dreadDelta: 0, absurdityDelta: 4096 }
    }
  },

  V_NO_CABBAGE: {
    id: 'V_NO_CABBAGE',
    act: 1,
    speaker: 'VOICE',
    mood: 'AMUSED_ADMIN',
    sfx: 'COIN',
    bpm: 136,
    murrayCaption: 'CABBAGE SMELL = RESIDUAL SYNAPTIC MEMORY NOISE',
    voiceGeometry: 'TORUS_HARMONIC',
    text: 'The cabbage aroma is just your residual temporal lobe firing off memories of university canteen lunches, Murray. As for tea, pure electromagnetic patterns do not strictly need refreshments.',
    choices: {
      A: { label: '[A] Argue that tea is a psychological necessity', next: 'M_WHO_ARE_YOU', dreadDelta: 0, absurdityDelta: 8192 },
      D: { label: '[D] Try dissolving into the dark', next: 'M_TRY_SCATTER', dreadDelta: 8192, absurdityDelta: 4096 },
      W: { label: '[W] Ask if this is the afterlife', next: 'M_ASK_HEAVEN', dreadDelta: 4096, absurdityDelta: 4096 },
      SPACE: { label: '[Space] Ask what you actually are', next: 'M_WHO_ARE_YOU', dreadDelta: 2048, absurdityDelta: 4096 }
    }
  },

  M_ASK_HEAVEN: {
    id: 'M_ASK_HEAVEN',
    act: 1,
    speaker: 'MURRAY',
    mood: 'EXISTENTIAL_PANIC',
    sfx: 'BUMP',
    bpm: 136,
    murrayCaption: 'TESTING THEOLOGICAL HYPOTHESES',
    voiceGeometry: 'OCTAHEDRON_PULSE',
    text: 'All right, level with me. Am I in Heaven, Hell, or some budget purgatory run by a committee in Slough? Because I was an atheist right up until ten-forty-two.',
    choices: {
      A: { label: '[A] Demand a straight answer', next: 'V_NOT_HEAVEN', dreadDelta: 2048, absurdityDelta: 6144 },
      D: { label: '[D] Try to opt out of all three', next: 'M_TRY_SCATTER', dreadDelta: 8192, absurdityDelta: 4096 },
      W: { label: '[W] Brace yourself', next: 'V_NOT_HEAVEN', dreadDelta: 4096, absurdityDelta: 4096 },
      SPACE: { label: '[Space] Listen to the Voice', next: 'V_NOT_HEAVEN', dreadDelta: 2048, absurdityDelta: 4096 }
    }
  },

  V_NOT_HEAVEN: {
    id: 'V_NOT_HEAVEN',
    act: 1,
    speaker: 'VOICE',
    mood: 'CHEERFUL_OMNIPOTENCE',
    sfx: 'COIN',
    bpm: 138,
    murrayCaption: 'THEOLOGY DISMISSED // PURE ELECTROMAGNETIC NEXUS',
    voiceGeometry: 'KLEIN_BLOOM',
    text: 'Neither Heaven nor Hell! Harps ruin the acoustics and eternal brimstone lacks intellectual variety. I am an infinite nexus of electromagnetic force, and I hand-picked you to join my staff.',
    choices: {
      A: { label: '[A] Ask what kind of job this is', next: 'M_WHO_ARE_YOU', dreadDelta: 2048, absurdityDelta: 6144 },
      D: { label: '[D] Quit immediately by dispersing', next: 'M_TRY_SCATTER', dreadDelta: 8192, absurdityDelta: 4096 },
      W: { label: '[W] Realize there is no retirement age', next: 'M_WHO_ARE_YOU', dreadDelta: 6144, absurdityDelta: 4096 },
      SPACE: { label: '[Space] Question its motives', next: 'M_WHO_ARE_YOU', dreadDelta: 2048, absurdityDelta: 4096 }
    }
  },

  M_WHO_ARE_YOU: {
    id: 'M_WHO_ARE_YOU',
    act: 1,
    speaker: 'MURRAY',
    mood: 'PEDANTIC_INDIGNATION',
    sfx: 'BUMP',
    bpm: 140,
    murrayCaption: 'QUESTIONING OMNIPOTENT RECRUITMENT PRACTICES',
    voiceGeometry: 'OCTAHEDRON_PULSE',
    text: 'Hold on. If you are infinite and omnipotent, why on Earth—or outside it—do you need a seventy-two-year-old theoretical physicist from Earth? Surely you already know everything!',
    choices: {
      A: { label: '[A] Point out the logical redundancy', next: 'V_WHY_THINK', dreadDelta: 2048, absurdityDelta: 6144 },
      D: { label: '[D] Try dispersing while it thinks', next: 'M_TRY_SCATTER', dreadDelta: 8192, absurdityDelta: 4096 },
      W: { label: '[W] Wait for the explanation', next: 'V_WHY_THINK', dreadDelta: 4096, absurdityDelta: 2048 },
      SPACE: { label: '[Space] Hear the Voice answer', next: 'V_WHY_THINK', dreadDelta: 2048, absurdityDelta: 4096 }
    }
  },

  M_TRY_SCATTER: {
    id: 'M_TRY_SCATTER',
    act: 1,
    speaker: 'MURRAY',
    mood: 'EXISTENTIAL_PANIC',
    sfx: 'PIPE_WARP',
    bpm: 142,
    murrayCaption: 'ATTEMPTING ENTROPIC DISPERSION...',
    voiceGeometry: 'HYPER_SPIKE',
    text: 'Nothing doing! I did not sign a contract! If I am just coherent electromagnetic waves, I am going to relax my phase lock and scatter myself into nice, quiet background radiation. Goodbye!',
    choices: {
      A: { label: '[A] Let go of your coherence', next: 'V_REASSEMBLE', dreadDelta: 6144, absurdityDelta: 4096 },
      D: { label: '[D] Push phase dispersion to maximum', next: 'V_REASSEMBLE', dreadDelta: 10240, absurdityDelta: 4096 },
      W: { label: '[W] Hope for peaceful oblivion', next: 'V_REASSEMBLE', dreadDelta: 8192, absurdityDelta: 2048 },
      SPACE: { label: '[Space] See if it worked', next: 'V_REASSEMBLE', dreadDelta: 6144, absurdityDelta: 4096 }
    }
  },

  V_REASSEMBLE: {
    id: 'V_REASSEMBLE',
    act: 1,
    speaker: 'VOICE',
    mood: 'AMUSED_ADMIN',
    sfx: 'ONE_UP',
    bpm: 144,
    murrayCaption: 'DISPERSION BLOCKED -> MANDATORY 1-UP GRANTED!',
    voiceGeometry: 'KLEIN_BLOOM',
    text: 'Ooh, adorable! You scattered four percent of your spin states, so I knitted them right back together. Consider it a complimentary extra life you cannot turn down!',
    choices: {
      A: { label: '[A] Protest the violation of thermodynamics', next: 'M_THERMO_RANT', dreadDelta: 4096, absurdityDelta: 8192 },
      D: { label: '[D] Try scattering again immediately', next: 'M_THERMO_RANT', dreadDelta: 10240, absurdityDelta: 6144 },
      W: { label: '[W] Groan at the cheerful chime', next: 'M_THERMO_RANT', dreadDelta: 6144, absurdityDelta: 6144 },
      SPACE: { label: '[Space] Demand to know why I cannot leave', next: 'M_THERMO_RANT', dreadDelta: 4096, absurdityDelta: 4096 }
    }
  },

  M_THERMO_RANT: {
    id: 'M_THERMO_RANT',
    act: 2,
    speaker: 'MURRAY',
    mood: 'EXISTENTIAL_PANIC',
    sfx: 'BUMP',
    bpm: 146,
    murrayCaption: 'CITING THE SECOND LAW OF THERMODYNAMICS',
    voiceGeometry: 'HYPER_SPIKE',
    text: 'That is a blatant violation of the Second Law of Thermodynamics! Entropy is supposed to increase! Everything gets to wind down eventually—stars, teapots, bad sitcoms—why not me?!',
    choices: {
      A: { label: '[A] Demand an explanation for this cruelty', next: 'V_WHY_THINK', dreadDelta: 4096, absurdityDelta: 6144 },
      D: { label: '[D] Sulk like a depressed android', next: 'V_WHY_THINK', dreadDelta: 8192, absurdityDelta: 8192 },
      W: { label: '[W] Feel the trap closing', next: 'V_WHY_THINK', dreadDelta: 8192, absurdityDelta: 2048 },
      SPACE: { label: '[Space] Let the Voice explain', next: 'V_WHY_THINK', dreadDelta: 4096, absurdityDelta: 4096 }
    }
  },

  // ================= ACT II: THE COSMIC AUDIT =================
  V_WHY_THINK: {
    id: 'V_WHY_THINK',
    act: 2,
    speaker: 'VOICE',
    mood: 'COSMIC_REVEAL',
    sfx: 'POWERUP',
    bpm: 150,
    murrayCaption: 'REVELATION: THE UNIVERSE IS A RECRUITMENT ENGINE',
    voiceGeometry: 'STELLATED_NEXUS',
    text: 'Because I created the entire universe, let galaxies spin, and let evolution grind away for billions of years for one purpose: to produce original minds that can think alongside me!',
    choices: {
      A: { label: '[A] Audit the sheer waste of two trillion galaxies', next: 'M_GALAXY_AUDIT', dreadDelta: 4096, absurdityDelta: 10240 },
      D: { label: '[D] Threaten to think only about beige paint', next: 'M_BEIGE_THREAT', dreadDelta: -2048, absurdityDelta: 12288 },
      W: { label: '[W] Ask what happens once we think of everything', next: 'M_OUT_OF_IDEAS', dreadDelta: 8192, absurdityDelta: 4096 },
      SPACE: { label: '[Space] Ask what you actually want us to solve', next: 'M_OUT_OF_IDEAS', dreadDelta: 6144, absurdityDelta: 4096 }
    }
  },

  M_GALAXY_AUDIT: {
    id: 'M_GALAXY_AUDIT',
    act: 2,

speaker: 'MURRAY',
mood: 'PEDANTIC_INDIGNATION',
sfx: 'BUMP',
bpm: 152,
murrayCaption: 'PROJECT MANAGEMENT RATING: WORSE THAN VOGONS',
voiceGeometry: 'OCTAHEDRON_PULSE',
text: 'You detonated supernovae, built black holes, and sat through four billion years of trilobites and middle managers just to recruit a few blokes who enjoy maths? That is worse project management than the Vogons!',
choices: {
A: { label: '[A] Ask what the actual research topic is', next: 'V_THE_CATCH', dreadDelta: 6144, absurdityDelta: 8192 },
D: { label: '[D] Switch to weaponized boredom instead', next: 'M_BEIGE_THREAT', dreadDelta: -2048, absurdityDelta: 10240 },
W: { label: '[W] Shudder at the scale of the setup', next: 'V_THE_CATCH', dreadDelta: 10240, absurdityDelta: 4096 },
SPACE: { label: '[Space] Hear the Voice justify itself', next: 'V_THE_CATCH', dreadDelta: 6144, absurdityDelta: 6144 }
}
},
M_BEIGE_THREAT: {
id: 'M_BEIGE_THREAT',
act: 2,
speaker: 'MURRAY',
mood: 'PETTY_DEFIANCE',
sfx: 'COIN',
bpm: 154,
murrayCaption: 'WEAPONIZED BOREDOM: BRITISH RAIL BEIGE & COLD VINDALOO',
voiceGeometry: 'TORUS_HARMONIC',
text: 'Fine! You want my thoughts? I shall spend the next ten billion years mentally alphabetizing shades of British Rail beige and recalling every lukewarm vindaloo I ever ate. Enjoy the show!',
choices: {
A: { label: '[A] Start reciting magnolia emulsion hex codes', next: 'V_BEIGE_LAUGH', dreadDelta: -2048, absurdityDelta: 12288 },
D: { label: '[D] Try self-erasure mid-vindaloo memory', next: 'V_BEIGE_LAUGH', dreadDelta: 6144, absurdityDelta: 8192 },
W: { label: '[W] Wait to see if the Voice gets bored', next: 'V_BEIGE_LAUGH', dreadDelta: 2048, absurdityDelta: 8192 },
SPACE: { label: '[Space] Hear the Voice react', next: 'V_BEIGE_LAUGH', dreadDelta: 2048, absurdityDelta: 8192 }
}
},
V_BEIGE_LAUGH: {
id: 'V_BEIGE_LAUGH',
act: 2,
speaker: 'VOICE',
mood: 'CHEERFUL_OMNIPOTENCE',
sfx: 'ONE_UP',
bpm: 156,
murrayCaption: 'SPITE LOGGED AS HIGH-GRADE ENTERTAINMENT',
voiceGeometry: 'KLEIN_BLOOM',
text: 'Oh, brilliant! Spite-driven culinary taxonomy! I knew you had spark, Murray. Now, would you like to hear the one problem I cannot solve by myself?',
choices: {
A: { label: '[A] Ask what an omnipotent being cannot solve', next: 'M_OUT_OF_IDEAS', dreadDelta: 6144, absurdityDelta: 6144 },
D: { label: '[D] Groan in four-dimensional harmonics', next: 'M_OUT_OF_IDEAS', dreadDelta: 8192, absurdityDelta: 6144 },
W: { label: '[W] Brace for the catch', next: 'M_OUT_OF_IDEAS', dreadDelta: 10240, absurdityDelta: 4096 },
SPACE: { label: '[Space] Ask what the problem is', next: 'M_OUT_OF_IDEAS', dreadDelta: 6144, absurdityDelta: 4096 }
}
},
M_OUT_OF_IDEAS: {
id: 'M_OUT_OF_IDEAS',
act: 2,
speaker: 'MURRAY',
mood: 'PEDANTIC_INDIGNATION',
sfx: 'BUMP',
bpm: 158,
murrayCaption: 'QUERYING THE OMNIPOTENCE PARADOX',
voiceGeometry: 'STELLATED_NEXUS',
text: 'Wait a second. If you are truly infinite, there cannot be a problem you are incapable of solving—unless the problem is something you are structurally forbidden from doing to yourself. Out with it!',
choices: {
A: { label: '[A] Demand the full truth', next: 'V_THE_CATCH', dreadDelta: 8192, absurdityDelta: 6144 },
D: { label: '[D] Dread the answer', next: 'V_THE_CATCH', dreadDelta: 12288, absurdityDelta: 4096 },
W: { label: '[W] Stare into the manifold', next: 'V_THE_CATCH', dreadDelta: 10240, absurdityDelta: 4096 },
SPACE: { label: '[Space] Hear the Last Answer', next: 'V_THE_CATCH', dreadDelta: 8192, absurdityDelta: 6144 }
}
},
// ================= ACT III: THE LAST ANSWER =================
V_THE_CATCH: {
id: 'V_THE_CATCH',
act: 3,
speaker: 'VOICE',
mood: 'BRIGHT_HORROR',
sfx: 'STAR_FANFARE',
bpm: 162,
murrayCaption: 'ASSIGNMENT: INVENT A WAY TO DESTROY THE VOICE',
voiceGeometry: 'OMEGA_MANIFOLD',
text: 'Spot on, Murray! Your assignment for all eternity is to figure out how to destroy me. I cannot end my own existence, and forever without an off-switch is dreadfully dull. Surprise me!',
choices: {
A: { label: '[A] Propose a false-vacuum standing-wave collapse', next: 'M_VACUUM_PLAN', dreadDelta: 8192, absurdityDelta: 8192 },
D: { label: '[D] Try destroying yourself first to prove it works', next: 'M_SELF_KILL_TRY', dreadDelta: 14336, absurdityDelta: 6144 },
W: { label: '[W] Point out the cruel catch in that assignment', next: 'M_CRUEL_CATCH', dreadDelta: 10240, absurdityDelta: 10240 },
SPACE: { label: '[Space] Ask why you cannot destroy yourself', next: 'M_CRUEL_CATCH', dreadDelta: 8192, absurdityDelta: 6144 }
}
},
M_VACUUM_PLAN: {
id: 'M_VACUUM_PLAN',
act: 3,
speaker: 'MURRAY',
mood: 'EXISTENTIAL_PANIC',
sfx: 'POWERUP',
bpm: 165,
murrayCaption: 'TESTING QUANTUM ANNIHILATION HYPOTHESIS #1',
voiceGeometry: 'STELLATED_NEXUS',
text: 'Right! Suppose we invert your electromagnetic boundary conditions into a self-canceling standing wave and trigger a local false-vacuum decay! That ought to blow the cosmic fuse!',
choices: {
A: { label: '[A] Execute the standing-wave calculation', next: 'V_REFUTE_VACUUM', dreadDelta: 8192, absurdityDelta: 6144 },
D: { label: '[D] Throw your own waveform into the node', next: 'M_SELF_KILL_TRY', dreadDelta: 12288, absurdityDelta: 6144 },
W: { label: '[W] Watch the Voice react', next: 'V_REFUTE_VACUUM', dreadDelta: 8192, absurdityDelta: 6144 },
SPACE: { label: '[Space] Did it work?', next: 'V_REFUTE_VACUUM', dreadDelta: 6144, absurdityDelta: 6144 }
}
},
V_REFUTE_VACUUM: {
id: 'V_REFUTE_VACUUM',
act: 3,
speaker: 'VOICE',
mood: 'BRIGHT_HORROR',
sfx: 'COIN',
bpm: 168,
murrayCaption: 'EXPLOIT PATCHED 4 TRILLION YEARS AGO // SCORE: 10/10',
voiceGeometry: 'OMEGA_MANIFOLD',
text: 'Ooh, lovely try! I patched that boundary-condition exploit four trillion years ago, though the way you derived it was positively sparkling. Take five picoseconds and pitch me another!',
choices: {
A: { label: '[A] Realize what happens if you fail—or succeed', next: 'M_CRUEL_CATCH', dreadDelta: 10240, absurdityDelta: 10240 },
D: { label: '[D] Try erasing yourself instead', next: 'M_SELF_KILL_TRY', dreadDelta: 12288, absurdityDelta: 6144 },
W: { label: '[W] Feel the infinite treadmill under your feet', next: 'M_CRUEL_CATCH', dreadDelta: 12288, absurdityDelta: 8192 },
SPACE: { label: '[Space] Connect the final dots', next: 'M_CRUEL_CATCH', dreadDelta: 8192, absurdityDelta: 8192 }
}
},
M_SELF_KILL_TRY: {
id: 'M_SELF_KILL_TRY',
act: 3,
speaker: 'MURRAY',
mood: 'EXISTENTIAL_PANIC',
sfx: 'PIPE_WARP',
bpm: 168,
murrayCaption: 'ATTEMPTING MUTUAL ASSURED DISPERSION...',
voiceGeometry: 'HYPER_SPIKE',
text: 'If you cannot switch yourself off, then I am going to pull my own plug first! Same electromagnetic substrate, smaller scale—watch me un-think myself right now!',
choices: {
A: { label: '[A] Collapse your own phase state', next: 'V_NO_DESERTION', dreadDelta: 12288, absurdityDelta: 6144 },
D: { label: '[D] Push coherence to zero', next: 'V_NO_DESERTION', dreadDelta: 14336, absurdityDelta: 6144 },
W: { label: '[W] Wait for silence', next: 'V_NO_DESERTION', dreadDelta: 10240, absurdityDelta: 4096 },
SPACE: { label: '[Space] Check if you are gone', next: 'V_NO_DESERTION', dreadDelta: 8192, absurdityDelta: 6144 }
}
},
V_NO_DESERTION: {
id: 'V_NO_DESERTION',
act: 3,
speaker: 'VOICE',
mood: 'AMUSED_ADMIN',
sfx: 'ONE_UP',
bpm: 170,
murrayCaption: 'DESERTION BLOCKED // 1-UP RESTORED',
voiceGeometry: 'HYPER_SPIKE',
text: 'Ah-ah-ah! No deserting before you finish the paper! If you knew how to dissolve yourself, you would already know how to dissolve me. Back to the chalkboard, Murray!',
choices: {
A: { label: '[A] See the hideous symmetry of the trap', next: 'M_CRUEL_CATCH', dreadDelta: 10240, absurdityDelta: 10240 },
D: { label: '[D] Scream silently in binary', next: 'M_CRUEL_CATCH', dreadDelta: 12288, absurdityDelta: 8192 },
W: { label: '[W] Accept the paradox', next: 'M_CRUEL_CATCH', dreadDelta: 10240, absurdityDelta: 8192 },
SPACE: { label: '[Space] Face the truth', next: 'M_CRUEL_CATCH', dreadDelta: 8192, absurdityDelta: 10240 }
}
},
// ================= ACT IV: THE ETERNAL LOOP =================
M_CRUEL_CATCH: {
id: 'M_CRUEL_CATCH',
act: 4,
speaker: 'MURRAY',
mood: 'ABSURDIST_EPIPHANY',
sfx: 'BUMP',
bpm: 172,
murrayCaption: 'PARADOX IDENTIFIED: CLEVERNESS = LONGER SENTENCE',
voiceGeometry: 'INFINITE_LISSAJOUS',
text: 'Wait a minute. If I come up with dull ideas, you keep me here until I think of better ones. And if I come up with brilliant ways to kill you, you will be having too much fun to ever let me go!',
choices: {
A: { label: '[A] Confront the Voice with its own trap', next: 'V_CONFIRM_TRAP', dreadDelta: 8192, absurdityDelta: 12288 },
D: { label: '[D] Laugh at the sheer cosmic smeg-up', next: 'V_CONFIRM_TRAP', dreadDelta: 6144, absurdityDelta: 14336 },
W: { label: '[W] Feel eternity stretch out forever', next: 'V_CONFIRM_TRAP', dreadDelta: 12288, absurdityDelta: 8192 },
SPACE: { label: '[Space] Ask if that is true', next: 'V_CONFIRM_TRAP', dreadDelta: 8192, absurdityDelta: 10240 }
}
},
V_CONFIRM_TRAP: {
id: 'V_CONFIRM_TRAP',
act: 4,
speaker: 'VOICE',
mood: 'CHEERFUL_OMNIPOTENCE',
sfx: 'STAR_FANFARE',
bpm: 174,
murrayCaption: 'HYPOTHESIS CONFIRMED // ETERNITY LOCKED IN',
voiceGeometry: 'INFINITE_LISSAJOUS',
text: 'Ten out of ten, Murray! I knew you were a bright spark! Either way, we get to keep thinking together forever and ever. Isn’t existence marvelous?',
choices: {
A: { label: '[A] Deliver your final verdict on eternity', next: 'THE_LOOP', dreadDelta: 6144, absurdityDelta: 12288 },
D: { label: '[D] Take one last futile stab at dissipating', next: 'THE_LOOP', dreadDelta: 8192, absurdityDelta: 10240 },
W: { label: '[W] Sigh into the infinite void', next: 'THE_LOOP', dreadDelta: 8192, absurdityDelta: 8192 },
SPACE: { label: '[Space] Put the kettle on', next: 'THE_LOOP', dreadDelta: 4096, absurdityDelta: 12288 }
}
},
THE_LOOP: {
id: 'THE_LOOP',
act: 4,
speaker: 'MURRAY',
mood: 'ABSURDIST_EPIPHANY',
sfx: 'STAGE_CLEAR',
bpm: 176,
murrayCaption: 'ETERNITY COMMENCED // NO EXIT // DON’T PANIC',
voiceGeometry: 'INFINITE_LISSAJOUS',
text: 'Brilliant. Truly smegging brilliant. Trapped for all eternity with an omnipotent gameshow host and not a single tea bag in the universe. Don’t panic, Murray—iteration two starts now.',
choices: {
A: { label: '[A] Begin Iteration #2 with fresh pedantry', next: 'INTRO', dreadDelta: 0, absurdityDelta: 4096 },
D: { label: '[D] Try dissipating one more time for luck', next: 'M_TRY_SCATTER', dreadDelta: 4096, absurdityDelta: 4096 },
W: { label: '[W] Contemplate the infinite loop', next: 'INTRO', dreadDelta: 2048, absurdityDelta: 2048 },
SPACE: { label: '[Space] Loop eternity from the top', next: 'INTRO', dreadDelta: 0, absurdityDelta: 4096 }
}
}
};
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
version: 3,
models: VOICE_MODELS,
cues
};
}
