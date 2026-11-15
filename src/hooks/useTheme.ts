import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { sfx } from '../lib/feedback';

export type Theme = 'dark' | 'light';
const KEY = 'am-theme';

function readTheme(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* storage unavailable */
  }
  return 'dark';
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0c0f' : '#f6f7f4');
}

type VTDoc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    apply(theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  /**
   * Switch theme with a circular reveal that grows from `origin` (usually the
   * toggle button). Falls back to an instant swap without View Transitions or
   * under reduced motion.
   */
  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const next: Theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    sfx(next === 'light' ? 'themeOn' : 'themeOff');
    const doc = document as VTDoc;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || reduce) {
      setTheme(next);
      return;
    }
    const x = origin?.x ?? window.innerWidth - 60;
    const y = origin?.y ?? 32;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const vt = doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
      apply(next);
    });
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 560, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  }, []);

  return { theme, toggle };
}
