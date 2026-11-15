import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PROFILE } from '../data/profile';

const KEY = 'am-intro-seen';

function shouldShow() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return sessionStorage.getItem(KEY) !== '1';
  } catch {
    return true;
  }
}

/** A short boot curtain shown once per browser session, then wiped upward. */
export function Intro() {
  const [show, setShow] = useState(shouldShow);

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setShow(false), 900);
    return () => window.clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro"
          aria-hidden="true"
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div className="intro-inner" exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
            <div className="intro-logo">
              {PROFILE.initials}
              <span>_</span>
            </div>
            <div className="intro-bar">
              <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }} />
            </div>
            <div className="intro-status">loading portfolio</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
