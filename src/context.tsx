import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { PROFILE } from './data/profile';
import { sfx } from './lib/feedback';

type Ctx = {
  skill: string | null;
  setSkill: (s: string | null) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  copyEmail: () => void;
  paletteOpen: boolean;
  projectId: string | null;
  setProjectId: (id: string | null) => void;
  setPaletteOpen: (v: boolean) => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [skill, setSkill] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const timer = useRef<number>();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    sfx('success', { haptic: false });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const copyEmail = useCallback(() => {
    const done = () => showToast('Email copied to clipboard');
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(PROFILE.email).then(done, () => (window.location.href = `mailto:${PROFILE.email}`));
    } else {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  }, [showToast]);

  return (
    <AppCtx.Provider value={{ skill, setSkill, toast, showToast, copyEmail, paletteOpen, setPaletteOpen, projectId, setProjectId }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp outside provider');
  return c;
}

let arriveTimer: number | undefined;

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
  if (id === 'top') return;
  // Once the scroll settles, play a short "arrival" sweep on the section head.
  window.clearTimeout(arriveTimer);
  document.querySelectorAll('.arrive').forEach((n) => n.classList.remove('arrive'));
  const mark = () => {
    window.removeEventListener('scrollend', mark);
    window.clearTimeout(arriveTimer);
    el.classList.remove('arrive');
    void el.offsetWidth;
    el.classList.add('arrive');
    arriveTimer = window.setTimeout(() => el.classList.remove('arrive'), 1400);
  };
  if ('onscrollend' in (window as object)) {
    window.addEventListener('scrollend', mark, { once: true });
    arriveTimer = window.setTimeout(mark, 1200);
  } else {
    arriveTimer = window.setTimeout(mark, 650);
  }
};
