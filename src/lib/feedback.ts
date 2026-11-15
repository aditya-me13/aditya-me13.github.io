/*
 * UI feedback: short synthesised click sounds (Web Audio, no audio files) and
 * haptics (Vibration API on Android; the checkbox-switch trick on iOS Safari).
 * One preference controls both, stored in localStorage under `am-sfx`.
 */

export type Sfx = 'tap' | 'select' | 'open' | 'close' | 'nav' | 'success' | 'themeOn' | 'themeOff';

const KEY = 'am-sfx';
const listeners = new Set<(on: boolean) => void>();

let enabled = (() => {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
})();

export const isFeedbackOn = () => enabled;

export function setFeedbackOn(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l(on));
}

export function onFeedbackChange(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ---------------- Sound ---------------- */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, to: number, start: number, dur: number, vol: number, type: OscillatorType = 'sine') {
  const a = ctx!;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  if (to !== freq) o.frequency.exponentialRampToValueAtTime(to, start + dur);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(master!);
  o.start(start);
  o.stop(start + dur + 0.02);
}

let noiseBuf: AudioBuffer | null = null;
function noise(start: number, dur: number, vol: number, f0: number, f1 = f0, q = 1.2) {
  const a = ctx!;
  if (!noiseBuf) {
    noiseBuf = a.createBuffer(1, Math.floor(a.sampleRate * 0.5), a.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = a.createBufferSource();
  src.buffer = noiseBuf;
  const bp = a.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = q;
  bp.frequency.setValueAtTime(f0, start);
  if (f1 !== f0) bp.frequency.exponentialRampToValueAtTime(f1, start + dur);
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + Math.min(0.01, dur / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  src.connect(bp).connect(g).connect(master!);
  src.start(start);
  src.stop(start + dur + 0.02);
}

const SOUNDS: Record<Sfx, (t: number) => void> = {
  // Crisp key-like tick.
  tap: (t) => {
    noise(t, 0.022, 0.22, 4200, 4200, 2.5);
    tone(1900, 1200, t, 0.035, 0.06, 'triangle');
  },
  // Slightly lower, rounder click for filters and tabs.
  select: (t) => {
    noise(t, 0.02, 0.16, 3000, 3000, 2);
    tone(1150, 820, t, 0.06, 0.08, 'sine');
  },
  open: (t) => {
    tone(420, 860, t, 0.14, 0.07, 'sine');
    noise(t, 0.12, 0.05, 900, 3200, 0.8);
  },
  close: (t) => {
    tone(820, 400, t, 0.12, 0.06, 'sine');
    noise(t, 0.1, 0.04, 2800, 800, 0.8);
  },
  // Soft whoosh for jumping between sections.
  nav: (t) => {
    noise(t, 0.22, 0.07, 500, 2600, 0.7);
    tone(660, 990, t, 0.08, 0.035, 'sine');
  },
  success: (t) => {
    tone(880, 880, t, 0.09, 0.07, 'sine');
    tone(1320, 1320, t + 0.075, 0.16, 0.07, 'sine');
  },
  themeOn: (t) => {
    tone(520, 520, t, 0.07, 0.07, 'triangle');
    tone(780, 780, t + 0.06, 0.12, 0.07, 'triangle');
  },
  themeOff: (t) => {
    tone(780, 780, t, 0.07, 0.07, 'triangle');
    tone(520, 520, t + 0.06, 0.12, 0.07, 'triangle');
  },
};

/* ---------------- Haptics ---------------- */

const VIBE: Record<Sfx, number | number[]> = {
  tap: 8,
  select: 10,
  open: 12,
  close: 8,
  nav: 6,
  success: [10, 50, 16],
  themeOn: [8, 40, 8],
  themeOff: [8, 40, 8],
};

let iosSwitch: HTMLLabelElement | null = null;
const canVibrate = () => typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
const isIOS = () => typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent);

// iOS Safari has no Vibration API, but toggling a native <input switch> from a
// user gesture produces a system haptic tick (iOS 17.4+).
function iosTick() {
  if (!iosSwitch) {
    iosSwitch = document.createElement('label');
    iosSwitch.setAttribute('aria-hidden', 'true');
    iosSwitch.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    input.tabIndex = -1;
    iosSwitch.appendChild(input);
    document.body.appendChild(iosSwitch);
  }
  iosSwitch.click();
}

export function haptic(kind: Sfx) {
  if (!enabled) return;
  if (canVibrate()) navigator.vibrate(VIBE[kind]);
  else if (isIOS()) iosTick();
}

let last = 0;
export function sfx(kind: Sfx, opts: { haptic?: boolean } = {}) {
  if (!enabled) return;
  const a = audio();
  if (a) {
    // Avoid stacking identical clicks fired by nested handlers in one gesture.
    const now = a.currentTime;
    if (kind !== 'tap' || now - last > 0.03) SOUNDS[kind](now + 0.002);
    last = now;
  }
  if (opts.haptic !== false) haptic(kind);
}

/* ---------------- Global click wiring ---------------- */

const CLICKABLE = 'a[href], button, [role="button"], [role="tab"], [role="option"], summary, label';

// Every button and link gets a click without having to annotate each one.
// Elements can opt into a different sound with data-sfx="select|open|..." or
// opt out with data-sfx="none" (for handlers that play their own sound).
export function installGlobalFeedback() {
  const onClick = (e: MouseEvent) => {
    const el = (e.target as Element | null)?.closest?.(CLICKABLE) as HTMLElement | null;
    if (!el || el === iosSwitch) return;
    if (el.matches(':disabled, [aria-disabled="true"]')) return;
    const kind = el.dataset.sfx;
    if (kind === 'none') return;
    if (kind && kind in SOUNDS) return sfx(kind as Sfx);
    if (el.matches('.filter, .tab, .sk, [aria-pressed], [role="tab"]')) return sfx('select');
    sfx('tap');
  };
  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}
