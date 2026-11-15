import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Command, Menu, Moon, Sun, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PROFILE, SECTIONS } from '../data/profile';
import { useActiveSection } from '../hooks/useActiveSection';
import { scrollToId, useApp } from '../context';
import { isFeedbackOn, onFeedbackChange, setFeedbackOn, sfx } from '../lib/feedback';

const ids = SECTIONS.map((s) => s.id);

export function Nav({ theme, onToggleTheme }: { theme: string; onToggleTheme: (origin?: { x: number; y: number }) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [sound, setSound] = useState(isFeedbackOn);
  useEffect(() => onFeedbackChange(setSound) as () => void, []);
  const [menu, setMenu] = useState(false);
  const active = useActiveSection(ids);
  const { setPaletteOpen } = useApp();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenu(false);
    scrollToId(id);
  };

  return (
    <>
      <header className={`nav${scrolled || menu ? ' scrolled' : ''}`}>
        <div className="container nav-inner">
          <a href="#top" className="logo" onClick={go('top')} aria-label={`${PROFILE.name}, back to top`}>
            {PROFILE.initials}
            <span className="cursor" />
          </a>
          <nav className="nav-links" aria-label="Sections">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={go(s.id)} data-sfx="nav" className={active === s.id ? 'active' : ''}>
                {s.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button className="cmdk-trigger" onClick={() => setPaletteOpen(true)} aria-label="Open command palette">
              <span className="label">Search</span>
              <span className="kbd">{isMac ? '⌘' : 'Ctrl'} K</span>
            </button>
            <button
              className="icon-btn"
              data-sfx="none"
              onClick={() => {
                const next = !sound;
                setFeedbackOn(next);
                if (next) sfx('success');
              }}
              aria-pressed={sound}
              aria-label={sound ? 'Mute sounds and haptics' : 'Turn on sounds and haptics'}
              title={sound ? 'Sound on' : 'Sound off'}
            >
              {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
            <button
              className="icon-btn"
              data-sfx="none"
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                onToggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
              }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="icon-btn menu-btn" onClick={() => setMenu((m) => !m)} data-sfx={menu ? 'close' : 'open'} aria-expanded={menu} aria-label="Menu">
              {menu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        <motion.div className="progress" style={{ scaleX }} />
      </header>
      <AnimatePresence>
        {menu && (
          <motion.nav
            className="mobile-sheet"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            aria-label="Sections"
          >
            {SECTIONS.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} onClick={go(s.id)} data-sfx="nav">
                {s.label}
                <span>0{i + 1}</span>
              </a>
            ))}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMenu(false);
                setPaletteOpen(true);
              }}
            >
              Command palette <Command size={15} />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
