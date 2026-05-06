// Tiny WebAudio-based sound engine — no external assets.
let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let muted = false;
let ambientNode: { stop: () => void } | null = null;
let ambientId = 0;

function ac() {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.35;
    masterGain.connect(ctx.destination);
  }
  return ctx!;
}

export function setMuted(m: boolean) {
  muted = m;
  if (masterGain) masterGain.gain.value = m ? 0 : 0.35;
}
export function setVolume(v: number) {
  if (masterGain && !muted) masterGain.gain.value = v;
}
export function isMuted() { return muted; }

export function blip(freq = 880, dur = 0.06, type: OscillatorType = "square") {
  try {
    const c = ac();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = 0.0001;
    g.gain.exponentialRampToValueAtTime(0.25, c.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g); g.connect(masterGain!);
    o.start(); o.stop(c.currentTime + dur + 0.02);
  } catch {}
}

export function typeKey() { blip(1200 + Math.random() * 400, 0.03, "square"); }
export function notify() { blip(660, 0.08); setTimeout(() => blip(880, 0.1), 80); }
export function glitchSound() {
  try {
    const c = ac();
    const o = c.createOscillator(); const g = c.createGain();
    o.type = "sawtooth"; o.frequency.setValueAtTime(120, c.currentTime);
    o.frequency.linearRampToValueAtTime(40, c.currentTime + 0.25);
    g.gain.value = 0.2;
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
    o.connect(g); g.connect(masterGain!);
    o.start(); o.stop(c.currentTime + 0.32);
  } catch {}
}

export function whoosh() {
  try {
    const c = ac();
    const o = c.createOscillator(); const g = c.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(900, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(120, c.currentTime + 0.5);
    g.gain.value = 0.0001;
    g.gain.exponentialRampToValueAtTime(0.18, c.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.55);
    o.connect(g); g.connect(masterGain!);
    o.start(); o.stop(c.currentTime + 0.6);
  } catch {}
}

export function heartbeat() {
  try {
    const c = ac();
    const beat = (t: number) => {
      const o = c.createOscillator(); const g = c.createGain();
      o.type = "sine"; o.frequency.value = 60;
      g.gain.value = 0.0001;
      g.gain.exponentialRampToValueAtTime(0.4, c.currentTime + t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t + 0.18);
      o.connect(g); g.connect(masterGain!);
      o.start(c.currentTime + t); o.stop(c.currentTime + t + 0.2);
    };
    beat(0); beat(0.18);
  } catch {}
}

export function siren(dur = 1.2) {
  try {
    const c = ac();
    const o = c.createOscillator(); const g = c.createGain();
    o.type = "triangle";
    const start = c.currentTime;
    for (let t = 0; t < dur; t += 0.25) {
      o.frequency.setValueAtTime(900, start + t);
      o.frequency.linearRampToValueAtTime(500, start + t + 0.25);
    }
    g.gain.value = 0.18;
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    o.connect(g); g.connect(masterGain!);
    o.start(); o.stop(start + dur + 0.05);
  } catch {}
}

export function startAmbient(level: number) {
  stopAmbient();
  if (level === 0) return;
  try {
    const c = ac();
    const id = ++ambientId;
    const osc = c.createOscillator();
    const osc2 = c.createOscillator();
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    const g = c.createGain();
    osc.type = "sine"; osc2.type = "triangle";
    const base = 80 + level * 20;
    osc.frequency.value = base;
    osc2.frequency.value = base * 1.5 + level;
    lfo.frequency.value = 0.2 + level * 0.15;
    lfoGain.gain.value = 4 + level * 2;
    lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
    g.gain.value = 0.04 + level * 0.025;
    osc.connect(g); osc2.connect(g); g.connect(masterGain!);
    osc.start(); osc2.start(); lfo.start();
    ambientNode = {
      stop: () => {
        if (id !== ambientId) return;
        try {
          g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.3);
          osc.stop(c.currentTime + 0.32);
          osc2.stop(c.currentTime + 0.32);
          lfo.stop(c.currentTime + 0.32);
        } catch {}
      },
    };
  } catch {}
}
export function stopAmbient() {
  ambientNode?.stop();
  ambientNode = null;
}

// === ANNOYING MUSIC ENGINE ===
// A circus/carousel-ish loop that gets louder & more distorted with panicLevel.
let musicState: {
  stop: () => void;
  setPanic: (p: number) => void;
} | null = null;

const MELODY = [523, 659, 784, 880, 784, 659, 587, 523, 698, 659, 587, 523, 494, 523]; // cheesy

export function startAnnoyingMusic(panic = 0) {
  stopAnnoyingMusic();
  try {
    const c = ac();
    const masterMusic = c.createGain();
    const dist = c.createWaveShaper();
    const makeCurve = (amount: number) => {
      const k = amount; const n = 256; const curve = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const x = (i * 2) / n - 1;
        curve[i] = ((3 + k) * x * 20) / (Math.PI + k * Math.abs(x));
      }
      return curve;
    };
    dist.curve = makeCurve(panic * 8);
    dist.oversample = "4x";

    const bass = c.createOscillator();
    const bassGain = c.createGain();
    bass.type = "square"; bass.frequency.value = 65;
    bassGain.gain.value = 0.1 + panic * 0.05;
    bass.connect(bassGain); bassGain.connect(masterMusic);

    masterMusic.gain.value = 0.18 + panic * 0.06;
    masterMusic.connect(dist); dist.connect(masterGain!);

    bass.start();

    let i = 0;
    let currentPanic = panic;
    const tickMs = () => Math.max(110, 220 - currentPanic * 18);
    let timer: any;
    const playNote = () => {
      try {
        const note = MELODY[i % MELODY.length];
        const now = c.currentTime;
        // main carousel voice
        const o = c.createOscillator(); const g = c.createGain();
        o.type = currentPanic > 2 ? "sawtooth" : "square";
        o.frequency.value = note * (currentPanic > 3 ? (Math.random() < 0.2 ? 0.5 : 1) : 1);
        g.gain.value = 0.0001;
        g.gain.exponentialRampToValueAtTime(0.25, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        o.connect(g); g.connect(masterMusic);
        o.start(now); o.stop(now + 0.2);

        // overlapping detuned voice for stacking effect at higher panic
        if (currentPanic >= 1) {
          const o2 = c.createOscillator(); const g2 = c.createGain();
          o2.type = "triangle";
          o2.frequency.value = note * 1.5;
          o2.detune.value = (Math.random() - 0.5) * 50 * currentPanic;
          g2.gain.value = 0.0001;
          g2.gain.exponentialRampToValueAtTime(0.18 + currentPanic * 0.04, now + 0.02);
          g2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          o2.connect(g2); g2.connect(masterMusic);
          o2.start(now); o2.stop(now + 0.2);
        }

        // meme honk at high panic
        if (currentPanic >= 2 && Math.random() < 0.18) {
          const h = c.createOscillator(); const hg = c.createGain();
          h.type = "sawtooth"; h.frequency.value = 220 + Math.random() * 120;
          hg.gain.value = 0.0001;
          hg.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
          hg.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          h.connect(hg); hg.connect(masterMusic);
          h.start(now); h.stop(now + 0.27);
        }
      } catch {}
      i++;
      timer = setTimeout(playNote, tickMs());
    };
    playNote();

    musicState = {
      stop: () => {
        try {
          clearTimeout(timer);
          bass.stop();
          masterMusic.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.2);
          setTimeout(() => { try { masterMusic.disconnect(); dist.disconnect(); } catch {} }, 300);
        } catch {}
      },
      setPanic: (p: number) => {
        currentPanic = p;
        try {
          masterMusic.gain.value = Math.min(0.6, 0.18 + p * 0.08);
          dist.curve = makeCurve(p * 10);
          bassGain.gain.value = Math.min(0.4, 0.1 + p * 0.06);
        } catch {}
      },
    };
  } catch {}
}

export function stopAnnoyingMusic() {
  musicState?.stop();
  musicState = null;
}

export function setMusicPanic(p: number) {
  musicState?.setPanic(p);
}

export function isMusicPlaying() { return musicState !== null; }
