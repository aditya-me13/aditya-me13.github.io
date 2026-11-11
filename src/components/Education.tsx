import { motion, useInView } from 'framer-motion';
import { GraduationCap, ScrollText } from 'lucide-react';
import { useRef } from 'react';
import { COURSES, DEGREE_URL, EDUCATION, TRANSCRIPT_URL } from '../data/profile';
import { useCountUp } from '../hooks/useCountUp';
import { DocLink } from './DocLink';
import { Reveal, SectionHead } from './Reveal';

export function Education() {
  const [main, ...rest] = EDUCATION;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const cpi = useCountUp(main.score, inView, 1800);

  return (
    <section className="section" id="education">
      <div className="container">
        <SectionHead eyebrow="05 / Education" title="Credentials." sub="My degree and full transcript are linked below for verification." />
        <div className="edu-layout">
          <Reveal>
            <div className="card edu-main" ref={ref}>
              <div className="grid-bg" />
              <div className="eyebrow" style={{ position: 'relative' }}>
                {main.period} · Graduated
              </div>
              <h3 className="school" style={{ marginTop: 12 }}>
                {main.school}
              </h3>
              <p className="deg">{main.degree}</p>
              <div className="cpi">
                <span className="big" aria-label={`CPI ${main.score} out of 10`}>
                  {cpi.toFixed(2)}
                </span>
                <span className="of">{main.scoreLabel}</span>
              </div>
              <div className="cpi-bar">
                <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: inView ? main.score / 10 : 0 }} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }} />
              </div>
              <p className="edu-note">{main.note}</p>
              <div className="edu-ctas">
                <DocLink href={DEGREE_URL} primary icon={<GraduationCap size={16} />}>
                  View degree
                </DocLink>
                <DocLink href={TRANSCRIPT_URL} icon={<ScrollText size={16} />}>
                  View transcript
                </DocLink>
              </div>
            </div>
          </Reveal>
          <div className="edu-side">
            {rest.map((e, i) => (
              <Reveal key={e.id} delay={0.08 * (i + 1)}>
                <div className="card edu-mini">
                  <div>
                    <div className="s">{e.school}</div>
                    <div className="d">
                      {e.degree} · {e.period}
                    </div>
                  </div>
                  <div className="sc">
                    {e.score}
                    <small>{e.scoreLabel}</small>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.24} className="courses card">
              <h4>Selected coursework</h4>
              <div className="course-list">
                {COURSES.map((c) => (
                  <span className="course" key={c.name}>
                    {c.name}
                    <b className={c.grade.startsWith('A') ? '' : 'b'}>{c.grade}</b>
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
