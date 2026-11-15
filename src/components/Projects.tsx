import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ArrowUpRight, Github, PlayCircle, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PROJECTS, PROJECT_CATEGORIES, SKILLS, type Project } from '../data/profile';
import { useApp } from '../context';
import { CloseButton, Overlay } from './Modal';
import { SectionHead } from './Reveal';

type Cat = (typeof PROJECT_CATEGORIES)[number];

function ProjectCard({ p, onOpen, skill }: { p: Project; onOpen: () => void; skill: string | null }) {
  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  const shown = skill && p.skills.includes(skill) ? [skill, ...p.skills.filter((s) => s !== skill)] : p.skills;
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="card proj"
      onMouseMove={onMove}
      onClick={onOpen}
      aria-haspopup="dialog"
    >
      <div className="proj-top">
        <span className="proj-cat">{p.category}</span>
        <span>{p.period}</span>
      </div>
      <h3>{p.title}</h3>
      <p>{p.short}</p>
      <div className="proj-foot">
        <div className="tags">
          {shown.slice(0, 2).map((s) => (
            <span key={s} className={`chip${s === skill ? ' hit' : ''}`}>
              {s}
            </span>
          ))}
          {shown.length > 2 && <span className="chip">+{shown.length - 2}</span>}
        </div>
        <span className="proj-open" aria-hidden="true">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </motion.button>
  );
}

function ProjectModal({ p, onClose }: { p: Project; onClose: () => void }) {
  const icon = (k: string) => (k === 'github' ? <Github size={15} /> : k === 'video' ? <PlayCircle size={15} /> : <ArrowUpRight size={15} />);
  return (
    <Overlay onClose={onClose} labelledBy="proj-title">
      <div className="card modal">
        <CloseButton onClick={onClose} />
        <span className="eyebrow">{p.category}</span>
        <h3 id="proj-title">{p.title}</h3>
        <div className="meta">
          {p.period}
          {p.advisor && ` · ${p.advisor.startsWith('Prof') ? 'Advisor: ' : ''}${p.advisor}`}
        </div>
        <ul className="bullets">
          {p.points.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
        <div className="sub-h">Stack</div>
        <div className="tag-row" style={{ marginTop: 10 }}>
          {p.skills.map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>
        {p.team && (
          <>
            <div className="sub-h">Built with</div>
            <div className="team">
              {p.team.map((t) => (
                <span className="avatar" key={t}>
                  <i>
                    {t
                      .split(' ')
                      .filter((w) => /^[A-Z]/.test(w))
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join('')}
                  </i>
                  {t}
                </span>
              ))}
            </div>
          </>
        )}
        {p.links && (
          <div className="hero-ctas" style={{ marginTop: 28 }}>
            {p.links.map((l, i) => (
              <a key={l.url} className={`btn${i === 0 ? ' btn-primary' : ''}`} href={l.url} target="_blank" rel="noopener noreferrer">
                {icon(l.kind)} {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </Overlay>
  );
}

export function Projects() {
  const [cat, setCat] = useState<Cat>('All');
  const { skill, setSkill, projectId: openId, setProjectId: setOpenId } = useApp();

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: PROJECTS.length };
    PROJECTS.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, []);

  const usage = useMemo(() => {
    const m: Record<string, number> = {};
    PROJECTS.forEach((p) => p.skills.forEach((s) => (m[s] = (m[s] ?? 0) + 1)));
    return m;
  }, []);

  const list = useMemo(() => {
    let l = PROJECTS;
    if (skill) l = l.filter((p) => p.skills.includes(skill));
    else if (cat !== 'All') l = l.filter((p) => p.category === cat);
    return [...l].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [cat, skill]);

  const open = PROJECTS.find((p) => p.id === openId);

  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHead
          eyebrow="03 / Projects"
          title="Things I’ve built."
          sub="Machine learning, secure software, hardware, algorithms and signal processing. Filter by area, or pick a skill to see the projects that use it."
        />
        <LayoutGroup id="filters">
          <div className="filters" role="toolbar" aria-label="Filter projects">
            {PROJECT_CATEGORIES.map((c) => {
              const on = !skill && cat === c;
              return (
                <button
                  key={c}
                  className={`filter${on ? ' on' : ''}`}
                  aria-pressed={on}
                  onClick={() => {
                    setSkill(null);
                    setCat(c);
                  }}
                >
                  {on && <motion.span layoutId="pill" className="pill-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  {c}
                  <span className="count">{counts[c] ?? 0}</span>
                </button>
              );
            })}
            {skill && (
              <span className="skill-filter-note">
                <b>{skill}</b> · {list.length} project{list.length === 1 ? '' : 's'}
                <button onClick={() => setSkill(null)} aria-label="Clear skill filter">
                  <X size={13} />
                </button>
              </span>
            )}
          </div>
        </LayoutGroup>
        <div className="skillbar" role="group" aria-label="Filter projects by skill">
          {SKILLS.map((g) => (
            <div className="skillbar-group" key={g.group}>
              <span className="skillbar-label">{g.group}</span>
              <div className="skillbar-list">
                {g.items.map((s) => {
                  const n = usage[s] ?? 0;
                  const on = skill === s;
                  return (
                    <button
                      key={s}
                      className={`sk${on ? ' on' : ''}`}
                      disabled={!n}
                      aria-pressed={on}
                      onClick={() => setSkill(on ? null : s)}
                      title={n ? `${n} project${n > 1 ? 's' : ''} use ${s}` : 'Used in work or coursework'}
                    >
                      {s}
                      {n > 0 && <span className="n">{n}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <motion.div layout className="proj-grid">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <ProjectCard key={p.id} p={p} skill={skill} onOpen={() => setOpenId(p.id)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <AnimatePresence>{open && <ProjectModal p={open} onClose={() => setOpenId(null)} />}</AnimatePresence>
    </section>
  );
}
