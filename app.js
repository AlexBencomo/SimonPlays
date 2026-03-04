// ── Instrument Reference ────────────────────────────────────────────
// Model:        Meinl Sonic Energy Compact Steel Tongue Drum
// SKU:          CSTD1DG
// Size:         10" / 28.8 cm diameter, 4.7" / 12 cm height
// Key:          B Minor
// Concert Pitch: A4 = 432 Hz
// Notes:        A3, B3, D4, E4, F#4, A4, B4, D5
// Material:     Upper shell: stainless steel, Lower shell: steel
// Color:        Dark Green
// Tongues:      8
//
// Reference frequencies (432 Hz tuning):
//   A3  = 216.00 Hz    B3  = 242.45 Hz
//   D4  = 288.33 Hz    E4  = 323.63 Hz
//   F#4 = 363.27 Hz    A4  = 432.00 Hz
//   B4  = 484.90 Hz    D5  = 576.65 Hz
//
// Physical tongue layout (viewed from above, "Sonic Energy" text facing you):
//   Top row (small tongues, higher pitch):   D5 (center), B4 (right), A4 (left)
//   Bottom row (large tongues, lower pitch): A3 (center), B3 (left),  D4 (right)
//   Side tongues (medium):                   E4 (left),   F#4 (right)
// ─────────────────────────────────────────────────────────────────────

// ── Tongue layout ───────────────────────────────────────────────────
const TONGUES = [
  { id: 0, note: 'D5',  freq: 576.65, angle: 0,   key: '8' },
  { id: 1, note: 'B4',  freq: 484.90, angle: 45,  key: '9' },
  { id: 2, note: 'F#4', freq: 363.27, angle: 90,  key: '6' },
  { id: 3, note: 'D4',  freq: 288.33, angle: 135, key: '3' },
  { id: 4, note: 'A3',  freq: 216.00, angle: 180, key: '2' },
  { id: 5, note: 'B3',  freq: 242.45, angle: 225, key: '1' },
  { id: 6, note: 'E4',  freq: 323.63, angle: 270, key: '4' },
  { id: 7, note: 'A4',  freq: 432.00, angle: 315, key: '7' },
];

const KEY_MAP = {};
TONGUES.forEach(t => {
  KEY_MAP['Numpad' + t.key] = t.id;
  KEY_MAP['Digit' + t.key] = t.id;
});

// ── Presets (values = slider values, not audio values) ──────────────
const PRESETS = {
  default: {
    harmonicity: 2.6, modulationIndex: 0.9, bloomCents: 8,
    attack: 35, decayScale: 0.8, modDecayRatio: 0.22,
    reverbWet: 50, reverbDecay: 3.2, subLevel: -20, volume: 0, bgmVolume: -15,
  },
  handpan: {
    harmonicity: 5.1, modulationIndex: 0.6, bloomCents: 8,
    attack: 30, decayScale: 1.4, modDecayRatio: 0.18,
    reverbWet: 55, reverbDecay: 5.5, subLevel: -18, volume: 0, bgmVolume: -15,
  },
  bell: {
    harmonicity: 7.0, modulationIndex: 2.2, bloomCents: 22,
    attack: 6, decayScale: 0.7, modDecayRatio: 0.55,
    reverbWet: 60, reverbDecay: 5, subLevel: -26, volume: -2, bgmVolume: -15,
  },
  marimba: {
    harmonicity: 2.0, modulationIndex: 0.3, bloomCents: 3,
    attack: 5, decayScale: 0.4, modDecayRatio: 0.12,
    reverbWet: 22, reverbDecay: 1.8, subLevel: -10, volume: 0, bgmVolume: -15,
  },
  deep: {
    harmonicity: 2.5, modulationIndex: 1.6, bloomCents: 15,
    attack: 45, decayScale: 1.6, modDecayRatio: 0.22,
    reverbWet: 65, reverbDecay: 6.5, subLevel: -6, volume: -2, bgmVolume: -15,
  },
};

// ── Songs ────────────────────────────────────────────────────────────
const SONGS = {
  twinkle: {
    title: 'Twinkle Twinkle Little Star',
    lines: [
      { lyric: 'Twinkle, twinkle, little star',  notes: [3,3,7,7,1,1,7] },
      { lyric: 'How I wonder what you are',       notes: [2,2,6,6,3] },
      { lyric: 'Up above the world so high',      notes: [7,7,2,2,6] },
      { lyric: 'Like a diamond in the sky',        notes: [7,7,2,2,6] },
      { lyric: 'Twinkle, twinkle, little star',   notes: [3,3,7,7,1,1,7] },
      { lyric: 'How I wonder what you are',        notes: [2,2,6,6,3] },
    ],
  },

  amazing_grace: {
    title: 'Amazing Grace',
    lines: [
      { lyric: 'Amazing grace, how sweet the sound',   notes: [3,2,7,7,2,7,1] },
      { lyric: 'That saved a wretch like me',           notes: [7,2,3,3,6,3] },
      { lyric: 'I once was lost, but now am found',     notes: [3,2,7,7,2,7,1] },
      { lyric: 'Was blind, but now I see',              notes: [0,1,7,7,2,3,6,3] },
    ],
  },

  mary_lamb: {
    title: 'Mary Had a Little Lamb',
    lines: [
      { lyric: 'Mary had a little lamb',               notes: [2,6,3,6,2,2,2] },
      { lyric: 'Little lamb, little lamb',              notes: [6,6,6,2,7,7] },
      { lyric: 'Mary had a little lamb',               notes: [2,6,3,6,2,2,2] },
      { lyric: 'Its fleece was white as snow',          notes: [2,6,6,2,6,3] },
    ],
  },

  auld_lang_syne: {
    title: 'Auld Lang Syne',
    lines: [
      { lyric: 'Should old acquaintance be forgot',     notes: [3,2,2,2,7,2,7,1] },
      { lyric: 'And never brought to mind',             notes: [7,2,2,7,1,0] },
      { lyric: 'Should old acquaintance be forgot',     notes: [1,0,0,1,7,2,7,1] },
      { lyric: 'And days of auld lang syne',            notes: [7,2,2,6,3] },
      { lyric: 'For auld lang syne, my dear',           notes: [7,0,0,1,7,2,7,1] },
      { lyric: 'For auld lang syne',                    notes: [7,2,2,6,3] },
      { lyric: 'We\'ll take a cup of kindness yet',     notes: [7,0,0,1,7,2,7,1] },
      { lyric: 'For auld lang syne',                    notes: [7,2,2,6,3] },
    ],
  },
};

// Slider → audio conversion + display formatting
const CONTROLS = {
  harmonicity:     { toAudio: v => v,        fmt: v => v.toFixed(2) },
  modulationIndex: { toAudio: v => v,        fmt: v => v.toFixed(1) },
  bloomCents:      { toAudio: v => v,        fmt: v => `${Math.round(v)} ct` },
  attack:          { toAudio: v => v / 1000, fmt: v => `${Math.round(v)} ms` },
  decayScale:      { toAudio: v => v,        fmt: v => `${v.toFixed(1)}x` },
  modDecayRatio:   { toAudio: v => v,        fmt: v => v.toFixed(2) },
  reverbWet:       { toAudio: v => v / 100,  fmt: v => `${Math.round(v)}%` },
  reverbDecay:     { toAudio: v => v,        fmt: v => `${parseFloat(v).toFixed(1)}s` },
  subLevel:        { toAudio: v => v,        fmt: v => `${Math.round(v)} dB` },
  volume:          { toAudio: v => v,        fmt: v => `${Math.round(v)} dB` },
  bgmVolume:       { toAudio: v => v,        fmt: v => `${Math.round(v)} dB` },
};

// ── AudioEngine ─────────────────────────────────────────────────────
class AudioEngine {
  constructor() {
    this.ready = false;
    this.voices = [];
    this.reverb = null;
    this.compressor = null;
    this.bgm = null;

    // Current audio-domain params (set via setParam)
    this.params = {
      harmonicity: 2.6,
      modulationIndex: 0.9,
      bloomCents: 8,
      attack: 0.035,
      decayScale: 0.8,
      modDecayRatio: 0.22,
      reverbWet: 0.50,
      reverbDecay: 3.2,
      subLevel: -20,
      volume: 0,
      bgmVolume: -15,
    };
  }

  async unlock() {
    if (this.ready) return;
    await Tone.start();

    const p = this.params;

    this.reverb = new Tone.Reverb({ decay: p.reverbDecay, wet: p.reverbWet }).toDestination();
    await this.reverb.generate();

    this.compressor = new Tone.Compressor({
      threshold: -22, ratio: 3, attack: 0.01, release: 0.15,
    }).connect(this.reverb);

    Tone.Destination.volume.value = p.volume;

    // BGM: looping Tetris theme, direct to destination (bypasses reverb/compressor)
    this.bgm = new Tone.Player({
      url: 'tetris-theme.mp3',
      loop: true,
      volume: p.bgmVolume,
      onload: () => { this.bgm.start(); },
    }).toDestination();

    TONGUES.forEach((t) => {
      const baseDecay = 2.0 + (1 - t.freq / 600) * 2.5;
      const d = baseDecay * p.decayScale;

      const main = new Tone.FMSynth({
        harmonicity: p.harmonicity,
        modulationIndex: p.modulationIndex,
        oscillator: { type: 'sine' },
        modulation: { type: 'sine' },
        envelope:           { attack: p.attack, decay: d,                     sustain: 0, release: 1.5 },
        modulationEnvelope: { attack: 0.01,     decay: d * p.modDecayRatio,   sustain: 0, release: 0.4 },
      }).connect(this.compressor);

      const sub = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: p.attack * 1.6, decay: d * 0.6, sustain: 0, release: 1.0 },
        volume: p.subLevel,
      }).connect(this.compressor);

      this.voices.push({ main, sub, freq: t.freq, baseDecay });
    });

    this.ready = true;
  }

  play(id) {
    if (!this.ready || id < 0 || id >= this.voices.length) return;
    const { main, sub, freq, baseDecay } = this.voices[id];
    const p = this.params;
    const now = Tone.now();
    const d = baseDecay * p.decayScale;

    // Bloom: start slightly sharp, settle to true pitch
    const bloomFreq = freq * Math.pow(2, p.bloomCents / 1200);
    main.triggerAttackRelease(bloomFreq, d + 1, now, 0.7);
    main.frequency.exponentialRampToValueAtTime(freq, now + 0.05);

    sub.triggerAttackRelease(freq / 2, d * 0.6 + 0.5, now, 0.5);
  }

  setParam(name, audioValue) {
    this.params[name] = audioValue;
    if (!this.ready) return;

    const p = this.params;

    switch (name) {
      case 'harmonicity':
        this.voices.forEach(v => { v.main.harmonicity.value = audioValue; });
        break;
      case 'modulationIndex':
        this.voices.forEach(v => { v.main.modulationIndex.value = audioValue; });
        break;
      case 'attack':
        this.voices.forEach(v => {
          v.main.envelope.attack = audioValue;
          v.sub.envelope.attack = audioValue * 1.6;
        });
        break;
      case 'decayScale':
        this.voices.forEach(v => {
          const d = v.baseDecay * audioValue;
          v.main.envelope.decay = d;
          v.main.modulationEnvelope.decay = d * p.modDecayRatio;
          v.sub.envelope.decay = d * 0.6;
        });
        break;
      case 'modDecayRatio':
        this.voices.forEach(v => {
          v.main.modulationEnvelope.decay = v.baseDecay * p.decayScale * audioValue;
        });
        break;
      case 'reverbWet':
        this.reverb.wet.value = audioValue;
        break;
      case 'reverbDecay':
        this.reverb.decay = audioValue;
        this.reverb.generate(); // async regeneration — imperceptible swap
        break;
      case 'subLevel':
        this.voices.forEach(v => { v.sub.volume.value = audioValue; });
        break;
      case 'volume':
        Tone.Destination.volume.value = audioValue;
        break;
      case 'bgmVolume':
        if (this.bgm) this.bgm.volume.value = audioValue;
        break;
      // bloomCents: read from params at play() time, no live update needed
    }
  }
}

// ── VisualEngine ────────────────────────────────────────────────────
class VisualEngine {
  constructor() {
    this.tongueEls = [];
    this.timeouts = new Map();
    TONGUES.forEach(t => {
      this.tongueEls.push(document.getElementById('tongue-' + t.id));
    });
  }

  strike(id) {
    const el = this.tongueEls[id];
    if (!el) return;
    if (this.timeouts.has(id)) clearTimeout(this.timeouts.get(id));
    el.classList.remove('tongue--active');
    void el.offsetWidth;
    el.classList.add('tongue--active');
    const timeout = setTimeout(() => {
      el.classList.remove('tongue--active');
      this.timeouts.delete(id);
    }, 1600);
    this.timeouts.set(id, timeout);
  }
}

// ── InputHandler ────────────────────────────────────────────────────
class InputHandler {
  constructor(onStrike) {
    this.onStrike = onStrike;
    this.touchFired = false;
    const svg = document.querySelector('.drum-svg');

    svg.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.touchFired = true;
      for (const touch of e.changedTouches) {
        const id = this._idFromPoint(touch.target);
        if (id !== null) this.onStrike(id);
      }
    }, { passive: false });

    svg.addEventListener('mousedown', (e) => {
      if (this.touchFired) { this.touchFired = false; return; }
      const id = this._idFromPoint(e.target);
      if (id !== null) this.onStrike(id);
    });

    document.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      // Don't trigger notes while interacting with panel controls
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      const id = KEY_MAP[e.code];
      if (id !== undefined) { e.preventDefault(); this.onStrike(id); }
    });
  }

  _idFromPoint(target) {
    let el = target;
    while (el && el !== document) {
      const attr = el.getAttribute && el.getAttribute('data-tongue-id');
      if (attr !== null) return parseInt(attr, 10);
      el = el.parentElement;
    }
    return null;
  }
}

// ── ControlPanel ────────────────────────────────────────────────────
class ControlPanel {
  constructor(audio) {
    this.audio = audio;
    this.sliders = {};
    this.valEls = {};
    this.presetSelect = document.getElementById('preset-select');

    // Cache slider + value display refs
    for (const param of Object.keys(CONTROLS)) {
      this.sliders[param] = document.getElementById('ctrl-' + param);
      this.valEls[param] = document.getElementById('val-' + param);
    }

    this._bindSliders();
    this._bindPresets();
    this._bindPanelToggle();
  }

  _bindSliders() {
    for (const [param, ctrl] of Object.entries(CONTROLS)) {
      const slider = this.sliders[param];
      if (!slider) continue;

      // Live update on drag
      slider.addEventListener('input', () => {
        const sliderVal = parseFloat(slider.value);
        this.valEls[param].textContent = ctrl.fmt(sliderVal);
        // For reverb decay, defer audio update to 'change' (mouseup)
        if (param !== 'reverbDecay') {
          this.audio.setParam(param, ctrl.toAudio(sliderVal));
        }
        // Mark preset as custom
        this.presetSelect.value = 'custom';
      });

      // Reverb decay regenerates impulse response on release
      if (param === 'reverbDecay') {
        slider.addEventListener('change', () => {
          this.audio.setParam('reverbDecay', ctrl.toAudio(parseFloat(slider.value)));
        });
      }
    }
  }

  _bindPresets() {
    this.presetSelect.addEventListener('change', () => {
      const name = this.presetSelect.value;
      if (name === 'custom' || !PRESETS[name]) return;
      this.applyPreset(name);
    });
  }

  applyPreset(name) {
    const preset = PRESETS[name];
    if (!preset) return;

    for (const [param, sliderVal] of Object.entries(preset)) {
      const ctrl = CONTROLS[param];
      const slider = this.sliders[param];
      if (!ctrl || !slider) continue;

      slider.value = sliderVal;
      this.valEls[param].textContent = ctrl.fmt(sliderVal);
      this.audio.setParam(param, ctrl.toAudio(sliderVal));
    }

    this.presetSelect.value = name;
  }

  _bindPanelToggle() {
    const panel = document.getElementById('panel');
    const toggle = document.getElementById('panel-toggle');
    const close = document.getElementById('panel-close');
    const scrim = document.getElementById('panel-scrim');

    const open = () => { panel.classList.add('open'); scrim.classList.add('open'); };
    const shut = () => { panel.classList.remove('open'); scrim.classList.remove('open'); };

    toggle.addEventListener('click', open);
    close.addEventListener('click', shut);
    scrim.addEventListener('click', shut);
  }
}

// ── LearnEngine ──────────────────────────────────────────────────────
class LearnEngine {
  constructor(visual) {
    this.visual = visual;
    this.state = 'idle'; // idle | playing | complete
    this.isActive = false;
    this.notes = [];
    this.lineMap = [];   // maps flat note index → line index
    this.cursor = 0;

    // DOM refs
    this.startBtn = document.getElementById('learn-start');
    this.resetBtn = document.getElementById('learn-reset');
    this.songSelect = document.getElementById('song-select');
    this.progressSection = document.getElementById('learn-progress-section');
    this.progressText = document.getElementById('learn-progress-text');
    this.progressFill = document.getElementById('learn-progress-fill');
    this.noteSection = document.getElementById('learn-note-section');
    this.noteDisplay = document.getElementById('learn-note-display');
    this.lyricsSection = document.getElementById('learn-lyrics-section');
    this.lyricsEl = document.getElementById('learn-lyrics');

    this.startBtn.addEventListener('click', () => this._start());
    this.resetBtn.addEventListener('click', () => this._reset());
    this._bindPanelToggle();
  }

  _start() {
    const songKey = this.songSelect.value;
    const song = SONGS[songKey];
    if (!song) return;

    // Flatten notes + build line map
    this.notes = [];
    this.lineMap = [];
    song.lines.forEach((line, li) => {
      line.notes.forEach(id => {
        this.lineMap.push(li);
        this.notes.push(id);
      });
    });

    this.cursor = 0;
    this.state = 'playing';
    this.isActive = true;

    this.startBtn.disabled = true;
    this.resetBtn.disabled = false;

    // Render lyrics
    this.lyricsEl.innerHTML = song.lines
      .map((line, i) => `<div class="lyric-line" data-line="${i}">${line.lyric}</div>`)
      .join('');

    // Show sections
    this.progressSection.style.display = '';
    this.noteSection.style.display = '';
    this.lyricsSection.style.display = '';

    this._updateDisplay();
    this._showHint();
  }

  _reset() {
    this._clearHint();
    this.state = 'idle';
    this.isActive = false;
    this.cursor = 0;
    this.notes = [];

    this.startBtn.disabled = false;
    this.resetBtn.disabled = true;

    this.progressSection.style.display = 'none';
    this.noteSection.style.display = 'none';
    this.lyricsSection.style.display = 'none';
    this.noteDisplay.innerHTML = '—';
    this.lyricsEl.innerHTML = '';
    this.progressFill.style.width = '0%';
    this.progressText.textContent = '0 / 0';
  }

  handleStrike(id) {
    if (this.state !== 'playing') return false;

    const expected = this.notes[this.cursor];

    if (id === expected) {
      // Correct
      this._clearHint();
      this._flashTongue(id, 'tongue--success');
      this.cursor++;

      if (this.cursor >= this.notes.length) {
        this._complete();
      } else {
        this._updateDisplay();
        this._showHint();
      }
      return true;
    } else {
      // Wrong — flash red, stay on same note
      this._flashTongue(id, 'tongue--wrong');
      return true;
    }
  }

  _showHint() {
    if (this.cursor >= this.notes.length) return;
    const targetId = this.notes[this.cursor];
    const el = this.visual.tongueEls[targetId];
    if (el) {
      el.classList.remove('tongue--active', 'tongue--success', 'tongue--wrong');
      el.classList.add('tongue--hint');
    }
  }

  _clearHint() {
    // Remove hint from all tongues
    this.visual.tongueEls.forEach(el => {
      if (el) el.classList.remove('tongue--hint');
    });
  }

  _flashTongue(id, cls) {
    const el = this.visual.tongueEls[id];
    if (!el) return;
    el.classList.remove('tongue--hint', 'tongue--active', 'tongue--success', 'tongue--wrong');
    void el.offsetWidth; // reflow to restart animation
    el.classList.add(cls);
    const duration = cls === 'tongue--wrong' ? 400 : 600;
    setTimeout(() => el.classList.remove(cls), duration);
  }

  _updateDisplay() {
    const total = this.notes.length;
    const done = this.cursor;
    this.progressText.textContent = `${done} / ${total}`;
    this.progressFill.style.width = `${(done / total) * 100}%`;

    // Note name + key hint
    const targetId = this.notes[this.cursor];
    const tongue = TONGUES.find(t => t.id === targetId);
    if (tongue) {
      this.noteDisplay.innerHTML =
        `${tongue.note}<span class="learn-key-hint">key: ${tongue.key}</span>`;
    }

    // Active lyric line
    const activeLine = this.lineMap[this.cursor];
    this.lyricsEl.querySelectorAll('.lyric-line').forEach((el, i) => {
      el.classList.remove('lyric-line--active', 'lyric-line--done');
      if (i === activeLine) el.classList.add('lyric-line--active');
      else if (i < activeLine) el.classList.add('lyric-line--done');
    });
  }

  _complete() {
    this.state = 'complete';
    this.isActive = false;
    this._clearHint();

    this.progressText.textContent = `${this.notes.length} / ${this.notes.length}`;
    this.progressFill.style.width = '100%';
    this.noteDisplay.innerHTML = '';
    this.noteSection.style.display = 'none';

    // Mark all lyrics done
    this.lyricsEl.querySelectorAll('.lyric-line').forEach(el => {
      el.classList.remove('lyric-line--active');
      el.classList.add('lyric-line--done');
    });

    // Show complete message
    const msg = document.createElement('div');
    msg.className = 'learn-complete';
    msg.textContent = 'Well done!';
    this.lyricsEl.parentElement.insertBefore(msg, this.lyricsEl);

    this.startBtn.disabled = false;
    this.resetBtn.disabled = false;

    // Clean up message on next start/reset
    const origStart = this.startBtn.onclick;
    const cleanup = () => { if (msg.parentElement) msg.remove(); };
    this.startBtn.addEventListener('click', cleanup, { once: true });
    this.resetBtn.addEventListener('click', cleanup, { once: true });
  }

  _bindPanelToggle() {
    const panel = document.getElementById('learn-panel');
    const toggle = document.getElementById('learn-toggle');
    const close = document.getElementById('learn-close');
    const scrim = document.getElementById('learn-scrim');

    const open = () => { panel.classList.add('open'); scrim.classList.add('open'); };
    const shut = () => { panel.classList.remove('open'); scrim.classList.remove('open'); };

    toggle.addEventListener('click', open);
    close.addEventListener('click', shut);
    scrim.addEventListener('click', shut);
  }
}

// ── Init ────────────────────────────────────────────────────────────
(function init() {
  const audio = new AudioEngine();
  const controls = new ControlPanel(audio);
  let visual = null;
  let input = null;
  let learn = null;

  const overlay = document.getElementById('overlay');

  function handleStrike(id) {
    if (learn && learn.isActive) {
      if (learn.handleStrike(id)) {
        audio.play(id);
        return;
      }
    }
    audio.play(id);
    visual.strike(id);
  }

  async function unlock() {
    await audio.unlock();
    overlay.classList.add('hidden');
    if (!visual) {
      visual = new VisualEngine();
      input = new InputHandler(handleStrike);
      learn = new LearnEngine(visual);
    }
  }

  overlay.addEventListener('click', unlock);
  overlay.addEventListener('touchstart', (e) => { e.preventDefault(); unlock(); }, { passive: false });
  document.addEventListener('keydown', async function firstKey(e) {
    if (overlay.classList.contains('hidden')) return;
    document.removeEventListener('keydown', firstKey);
    await unlock();
    const id = KEY_MAP[e.code];
    if (id !== undefined) handleStrike(id);
  });
})();
