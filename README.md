# The Last Answer: Non-Dual Chiptune Edition

A deterministic, zero-dependency browser simulation adapting Isaac Asimov’s *"The Last Answer"* (1980) through the absurdist British science-fiction register of *The Hitchhiker's Guide to the Galaxy* and *Red Dwarf*—set to an unapologetically upbeat 4-channel 16-bit platformer soundtrack.

Built atop the `Q16.16` fixed-point determinism of **Zen-Parable**, the `480×272` `CLUT8` De Casteljau bicubic Bézier geometry of **non-dual-holonomy-psp**, and dual-voice **Piper neural TTS** rendered automatically via GitHub Actions.

## Premise & Split-Screen Architecture

* **Left Viewport (`240×272`) — Murray Templeton:** An exasperated, newly deceased theoretical physicist reconstituted as a cyan electromagnetic plasma vortex (`en_GB-northern_english_male-medium`), armed only with dry British pedantry, Second Law objections, and a floating cosmic clipboard.
* **Right Viewport (`240×272`) — The Voice:** An omnipotent electromagnetic nexus (`en_GB-alan-medium`) rendered as a `4×4` De Casteljau bicubic Bézier manifold whose control grid deforms in real time to the RMS audio energy of every spoken syllable.
* **Upbeat 4-Channel Chiptune Contrast:** A 128-step (8-bar) WebAudio sequencer (square lead, sawtooth harmony, triangle walking bass, and LFSR percussion) plays cheerful C-major/G7 platformer grooves that accelerate in BPM (`132 -> 210 BPM`) as Murray realizes eternity has no tea urn and no exit.

## Controls

| Key | Action | Effect |
| :--- | :--- | :--- |
| **`A`** | **Pedantic Objection** | Challenge cosmic bureaucracy, Vogon-grade project management, or thermodynamic violations. |
| **`D`** | **Attempt Un-Thinking** | Scatter Murray’s electromagnetic coherence (the Voice cheerfully reassembles him to a *1-Up* arpeggio). |
| **`W`** | **Existential Sigh** | Absorb the crushing weight of eternal research conscription. |
| **`Space`** | **Advance / Paradox** | Progress the 22-node, 4-act call-and-response dialogue or enter the next iteration of eternity. |
| **`M`** | **Mute / Unmute** | Toggle the chiptune synthesizer and voice playback. |

## Documentation & Deep Dives

* **[Academic Preprint (`docs/preprint.md`)](docs/preprint.md):** Full mathematical, existential, pedagogical, and epistemic analysis with APA 7th edition references.
* **[Plain-Language Explainer (`docs/BILL_NYE_LAST_ANSWER_TILE_EXPLAINER.md`)](docs/BILL_NYE_LAST_ANSWER_TILE_EXPLAINER.md):** Accessible breakdown of `Q16.16` fixed-point math, De Casteljau Bézier surfaces, `CLUT8` Bayer dithering, and WebAudio synthesis.

## Quickstart (Termux & Desktop)

No bundlers or `npm install` required.

```bash
# 1. Clone and enter the repository
git clone https://github.com
cd last-answer-nondual-edition

# 2. Run the deterministic kernel & manifest parity test suite
node --test

# 3. Serve locally (Termux or desktop)
python3 -m http.server 8080
```

Open `http://localhost:8080` in your browser and tap **Initialize Eternity** (or press any action key) to unlock WebAudio and dual-voice Piper TTS playback.

## Automated Dual-Voice Piper TTS Pipeline

Every dialogue node in `src/script-data.js` is hashed via 32-bit FNV-1a (`model + ':' + text`) into `audio/manifest.json`. Pushing changes to `audio/manifest.json` triggers `.github/workflows/build-piper-audio.yml`, which synthesizes all `audio/<hash>.wav` files on Ubuntu CI using `en_GB-alan-medium` (The Voice) and `en_GB-northern_english_male-medium` (Murray) and commits them back to `main`.

If offline `.wav` files are not present locally, `src/piper-bridge.js` seamlessly falls back to browser `speechSynthesis` layered with a real-time WebAudio dual-formant vocal synthesizer so the Bézier manifold remains speech-reactive.

## Repository Structure

```text
last-answer-nondual-edition/
├── index.html                                    # Split-screen 480x272 viewport + aria-live log
├── style.css                                     # High-contrast retro-cosmic split-screen layout
├── package.json                                  # Zero-dependency ES module & node --test manifest
├── .github/workflows/build-piper-audio.yml       # CI workflow rendering dual-voice Piper WAVs
├── docs/
│   ├── preprint.md                               # Mathematical, existential & epistemic preprint
│   └── BILL_NYE_LAST_ANSWER_TILE_EXPLAINER.md     # Plain-language science & graphics explainer
├── audio/
│   ├── manifest.json                             # FNV-1a hash-to-line lookup for 22 dual-voice cues
│   └── *.wav                                     # CI-rendered Piper neural TTS voice files
├── src/
│   ├── core.js                                   # Q16.16 fixed-point math, PRNG, and FNV-1a hasher
│   ├── script-data.js                            # 22-node 4-act Asimov / Red Dwarf / Hitchhiker's script
│   ├── story-kernel.js                           # Deterministic Dread/Absurdity/Coherence state machine
│   ├── split-renderer.js                         # Left: EM Murray | Right: Q16.16 Bezier Voice (CLUT8)
│   ├── chiptune-synth.js                         # 4-channel 8-bar upbeat WebAudio sequencer & SFX
│   ├── piper-bridge.js                           # Piper WAV loader, formant fallback & RMS envelope
│   └── main.js                                   # 60 Hz fixed-timestep loop, input & DOM sync
├── tools/
│   └── build-piper-audio.mjs                     # Multi-voice Piper batch renderer
└── test/
    └── story-kernel.test.mjs                     # Zero-dependency deterministic & graph parity tests
```
