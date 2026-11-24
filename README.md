# The Last Answer: Non-Dual Chiptune Edition

A deterministic, zero-dependency browser experience adapting Isaac Asimov’s *"The Last Answer"* (1980) through the lens of *The Hitchhiker's Guide to the Galaxy* and *Red Dwarf*—set to an unapologetically upbeat 16-bit platformer soundtrack.

Built atop the `Q16.16` fixed-point determinism of **Zen-Parable**, the `480×272 CLUT8` De Casteljau Bezier geometry of **non-dual-holonomy-psp**, and **Piper TTS** (`en_GB-alan-medium`).

## Premise & Split-Screen Architecture
* **Left Viewport (`240×272`) — Murray Templeton:** An exasperated, newly deceased physicist reconstituted as an electromagnetic vortex, armed only with dry British sarcasm and a cosmic clipboard.
* **Right Viewport (`240×272`) — The Voice:** An omnipotent electromagnetic nexus rendered as a reactive `Q16.16` Bezier manifold whose control grid deforms in real time to Piper TTS audio output.
* **Upbeat Chiptune Contrast:** A multi-channel WebAudio square/triangle sequencer plays cheerful, bouncy platformer melodies that accelerate in tempo as Murray realizes eternity has no tea breaks and no exit.

## Controls

| Key | Action | Effect |
| :--- | :--- | :--- |
| **`A`** | **Pedantic Objection** | Point out bureaucratic or thermodynamic flaws in eternal existence. |
| **`D`** | **Attempt Un-Thinking** | Try to scatter your own electromagnetic coherence (the Voice cheerfully reassembles you to a 1-Up arpeggio). |
| **`W`** | **Existential Sigh** | Shift focus between cosmic dread and absurdist acceptance. |
| **`Space`** | **Advance / Paradox** | Progress dialogue or trigger a logical loop that amuses the Voice. |
| **`M`** | **Mute / Unmute** | Toggle the upbeat chiptune synthesizer. |

## Quickstart (Termux & Desktop)
No bundlers or `npm install` required.

```bash
# 1. Clone and enter the repository
git clone https://github.com
cd last-answer-nondual-edition

# 2. Run the deterministic kernel test suite
node --test

# 3. Serve locally (Termux or desktop)
python3 -m http.server 8080
```
Open `http://localhost:8080` in your browser and press any key or click **Initialize Eternity** to unlock WebAudio and Piper TTS playback.

## Generating Piper TTS Voice Lines (Optional)
Audio cues are keyed by FNV-1a content hashes in `audio/manifest.json`. If Piper (`piper-tts`) and `en_GB-alan-medium.onnx` are installed in Termux or Linux:

```bash
node tools/build-piper-audio.mjs
```
If offline `.wav` files are absent, the engine seamlessly falls back to formant-modulated WebAudio synthesis so the Bezier manifold remains reactive.

## Repository Structure
```text
last-answer-nondual-edition/
├── index.html                  # Split-screen 480x272 viewport + accessible aria-live log
├── style.css                   # High-contrast retro-cosmic split-screen layout
├── package.json                # Zero-dependency ES module & node --test manifest
├── audio/
│   └── manifest.json           # FNV-1a hash-to-line lookup for Piper TTS cues
├── src/
│   ├── core.js                 # Q16.16 fixed-point math, PRNG, and FNV-1a hasher
│   ├── script-data.js          # Asimov + Red Dwarf / Hitchhiker's branching dialogue
│   ├── story-kernel.js         # Deterministic Dread/Absurdity state machine
│   ├── split-renderer.js       # Left: EM Murray | Right: Q16.16 Bezier Voice (CLUT8)
│   ├── chiptune-synth.js       # Upbeat Mario-style WebAudio sequencer & SFX
│   ├── piper-bridge.js         # Piper TTS audio loader + real-time Bezier spring driver
│   └── main.js                 # Fixed-timestep loop, input bindings, and DOM sync
├── tools/
│   └── build-piper-audio.mjs   # Offline generator for FNV-1a hashed Piper .wav files
└── test/
    └── story-kernel.test.mjs   # Zero-dependency deterministic state & parity tests
```
