import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { EXPERIENCE } from '../data/profile';
import { Reveal, SectionHead } from './Reveal';

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [open, setOpen] = useState<Set<string>>(() => new Set(EXPERIENCE.filter((e) => e.points.length).slice(0, 1).map((e) => e.id)));

  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <section className="section" id="experience">
      <div className="container">
        <SectionHead eyebrow="02 / Experience" title="Where I’ve worked." sub="From production ML at a start-up to the Investment Bank at Barclays. Tap a role to expand it." />
        <div className="timeline" ref={ref}>
          <div className="timeline-rail" />
          <motion.div className="timeline-fill" style={{ scaleY }} />
          {EXPERIENCE.map((e, i) => {
            const isOpen = open.has(e.id);
            const expandable = e.points.length > 0 || (e.links?.length ?? 0) > 0;
            return (
              <Reveal key={e.id} delay={i * 0.05}>
                <div className={`tl-item${e.current ? ' current' : ''}${isOpen ? ' open' : ''}`}>
                  <span className="tl-dot" />
                  <div className="card tl-card">
                    <div className="tl-head">
                      <div>
                        <div className="tl-company">
                          {e.companyUrl ? (
                            <a href={e.companyUrl} target="_blank" rel="noopener noreferrer">
                              {e.company}
                            </a>
                          ) : (
                            e.company
                          )}
                          {e.current && <span className="live-badge">NOW</span>}
                        </div>
                        <h3 className="tl-role">{e.role}</h3>
                        <div className="tl-meta">
                          {e.period} · {e.location}
                          {e.kind !== e.role && ` · ${e.kind}`}
                        </div>
                      </div>
                      {expandable && (
                        <button className="tl-toggle" onClick={() => toggle(e.id)} aria-expanded={isOpen} aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${e.company} details`}>
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                    <p className="tl-summary">{e.summary}</p>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          className="tl-body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {e.points.length > 0 && (
                            <ul className="bullets">
                              {e.points.map((p, j) => (
                                <li key={j}>{p}</li>
                              ))}
                            </ul>
                          )}
                          {e.links && (
                            <div className="link-row">
                              {e.links.map((l) => (
                                <a key={l.url} className="link-arrow" href={l.url} target="_blank" rel="noopener noreferrer">
                                  {l.label} <ArrowUpRight size={14} />
                                </a>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="tag-row">
                      {e.tags.map((t) => (
                        <span className="chip" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
