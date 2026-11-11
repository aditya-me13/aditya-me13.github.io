import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { LEADERSHIP } from '../data/profile';
import { SectionHead } from './Reveal';

export function Leadership() {
  const [tab, setTab] = useState(0);
  const group = LEADERSHIP[tab];
  return (
    <section className="section" id="leadership">
      <div className="container">
        <SectionHead eyebrow="06 / Leadership" title="Beyond the classroom." sub="Roles where I organised, mentored or represented people at IIT Gandhinagar." />
        <LayoutGroup id="lead">
          <div className="tabs" role="tablist" aria-label="Leadership categories">
            {LEADERSHIP.map((g, i) => (
              <button key={g.group} role="tab" aria-selected={tab === i} className={`tab${tab === i ? ' on' : ''}`} onClick={() => setTab(i)}>
                {tab === i && <motion.span layoutId="tab-bg" className="tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                {g.group} <span className="mono" style={{ fontSize: 11, opacity: 0.6 }}>{g.roles.length}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
        <AnimatePresence mode="wait">
          <motion.div
            key={group.group}
            className="roles"
            role="tabpanel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            {group.roles.map((r) => (
              <article className="card role" key={r.title + r.org}>
                <div className="p">{r.period}</div>
                <h3>{r.title}</h3>
                <div className="o">{r.org}</div>
                <ul className="bullets">
                  {r.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                {r.link && (
                  <div className="link-row">
                    <a className="link-arrow" href={r.link} target="_blank" rel="noopener noreferrer">
                      See the work <ArrowUpRight size={14} />
                    </a>
                  </div>
                )}
              </article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
