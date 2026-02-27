// ── Tongue layout ───────────────────────────────────────────────────
const TONGUES = [
  { id: 0, note: 'D5', freq: 587.33, angle: 0,   key: '8' },
  { id: 1, note: 'C5', freq: 523.25, angle: 45,  key: '9' },
  { id: 2, note: 'G4', freq: 392.00, angle: 90,  key: '6' },
  { id: 3, note: 'D4', freq: 293.66, angle: 135, key: '3' },
  { id: 4, note: 'A3', freq: 220.00, angle: 180, key: '2' },
  { id: 5, note: 'C4', freq: 261.63, angle: 225, key: '1' },
  { id: 6, note: 'E4', freq: 329.63, angle: 270, key: '4' },
  { id: 7, note: 'A4', freq: 440.00, angle: 315, key: '7' },
];

const KEY_MAP = {};
TONGUES.forEach(t => {
  KEY_MAP['Numpad' + t.key] = t.id;
  KEY_MAP['Digit' + t.key] = t.id;
});

// ── Presets (values = slider values, not audio values) ──────────────
const PRESETS = {
  default: {
    harmonicity: 3.01, modulationIndex: 1.2, bloomCents: 12,
    attack: 25, decayScale: 1.0, modDecayRatio: 0.3,
    reverbWet: 45, reverbDecay: 4, subLevel: -14, volume: 0,
  },
  handpan: {
    harmonicity: 5.1, modulationIndex: 0.6, bloomCents: 8,
    attack: 30, decayScale: 1.4, modDecayRatio: 0.18,
    reverbWet: 55, reverbDecay: 5.5, subLevel: -18, volume: 0,
  },
  bell: {
    harmonicity: 7.0, modulationIndex: 2.2, bloomCents: 22,
    attack: 6, decayScale: 0.7, modDecayRatio: 0.55,
    reverbWet: 60, reverbDecay: 5, subLevel: -26, volume: -2,
  },
  marimba: {
    harmonicity: 2.0, modulationIndex: 0.3, bloomCents: 3,
    attack: 5, decayScale: 0.4, modDecayRatio: 0.12,
    reverbWet: 22, reverbDecay: 1.8, subLevel: -10, volume: 0,
  },
  deep: {
    harmonicity: 2.5, modulationIndex: 1.6, bloomCents: 15,
    attack: 45, decayScale: 1.6, modDecayRatio: 0.22,
    reverbWet: 65, reverbDecay: 6.5, subLevel: -6, volume: -2,
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
};

// ── AudioEngine ─────────────────────────────────────────────────────
class AudioEngine {
  constructor() {
    this.ready = false;
    this.voices = [];
    this.reverb = null;
    this.compressor = null;

    // Current audio-domain params (set via setParam)
    this.params = {
      harmonicity: 3.01,
      modulationIndex: 1.2,
      bloomCents: 12,
      attack: 0.025,
      decayScale: 1.0,
      modDecayRatio: 0.3,
      reverbWet: 0.45,
      reverbDecay: 4,
      subLevel: -14,
      volume: 0,
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

// ── Init ────────────────────────────────────────────────────────────
(function init() {
  const audio = new AudioEngine();
  const controls = new ControlPanel(audio);
  let visual = null;
  let input = null;

  const overlay = document.getElementById('overlay');

  function handleStrike(id) {
    audio.play(id);
    visual.strike(id);
  }

  async function unlock() {
    await audio.unlock();
    overlay.classList.add('hidden');
    if (!visual) {
      visual = new VisualEngine();
      input = new InputHandler(handleStrike);
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
