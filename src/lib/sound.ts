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
  const c = ac();
  const o = c.createOscillator(); const g = c.createGain();
  o.type = "sawtooth"; o.frequency.setValueAtTime(120, c.currentTime);
  o.frequency.linearRampToValueAtTime(40, c.currentTime + 0.25);
  g.gain.value = 0.2;
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
  o.connect(g); g.connect(masterGain!);
  o.start(); o.stop(c.currentTime + 0.32);
}

export function startAmbient(level: number) {
  stopAmbient();
  if (level === 0) return;
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
}
export function stopAmbient() {
  ambientNode?.stop();
  ambientNode = null;
}
