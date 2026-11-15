import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, FileText, GraduationCap, ScrollText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CURRENT_ROLE, DEGREE_URL, PROFILE, RESUME_URL, TRANSCRIPT_URL, filled } from '../data/profile';
import { scrollToId } from '../context';
import { DocLink } from './DocLink';
import { HeroField } from './HeroField';

function Typed({ lines }: { lines: string[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [text, setText] = useState(reduce ? lines[0] : '');
  const [del, setDel] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const full = lines[i % lines.length];
    let t: number;
    if (!del && text === full) t = window.setTimeout(() => setDel(true), 2200);
    else if (del && text === '') {
      setDel(false);
      setI((n) => n + 1);
      return;
    } else
      t = window.setTimeout(
        () => setText(del ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1)),
        del ? 28 : 55,
      );
    return () => clearTimeout(t);
  }, [text, del, i, lines, reduce]);

  return (
    <p className="hero-typed" aria-label={lines.join(', ')}>
      <span className="prompt">~$</span>
      <span aria-hidden="true">{text}</span>
      <span className="caret" aria-hidden="true" />
    </p>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const anim = (d: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 26 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: d, ease } };
  const [first, ...rest] = PROFILE.name.split(' ');
  const role = filled(CURRENT_ROLE.title);

  return (
    <section className="hero" id="top">
      <HeroField />
      <div className="hero-vignette" />
      <div className="container hero-grid">
        <motion.figure className="hero-photo" {...anim(0.2)}>
          <img src={PROFILE.photo} alt={`Portrait of ${PROFILE.name}`} width={480} height={480} fetchPriority="high" />
        </motion.figure>
        <div className="hero-content">
          <motion.div className="status-pill" {...anim(0.05)}>
            <span className="pulse" />
            Currently at <b>Barclays</b>
            {role && <span>· {role}</span>}
          </motion.div>
          <motion.h1 className="hero-name" {...anim(0.15)}>
            {first} <span className="dim">{rest.join(' ')}</span>
          </motion.h1>
          <motion.div {...anim(0.3)}>
            <Typed lines={PROFILE.rotating} />
          </motion.div>
          <motion.p className="hero-lede" {...anim(0.42)}>
            <strong>Computer Science &amp; Engineering graduate from IIT Gandhinagar</strong>, now building at{' '}
            <strong>Barclays</strong>. I work where finance meets code: quantitative tooling, machine learning, and the systems
            underneath them.
          </motion.p>
          <motion.div className="hero-ctas" {...anim(0.55)}>
            <DocLink href={RESUME_URL} primary icon={<FileText size={16} />}>
              Résumé
            </DocLink>
            <DocLink href={DEGREE_URL} icon={<GraduationCap size={16} />}>
              Degree
            </DocLink>
            <DocLink href={TRANSCRIPT_URL} icon={<ScrollText size={16} />}>
              Transcript
            </DocLink>
            <a
              className="btn"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('contact');
              }}
            >
              Get in touch <ArrowDownRight size={16} />
            </a>
          </motion.div>
        </div>
      </div>
      <div className="scroll-cue" aria-hidden="true">
        SCROLL
        <i />
      </div>
    </section>
  );
}
