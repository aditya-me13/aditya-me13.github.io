import { MousePointerClick } from 'lucide-react';
import { useMemo } from 'react';
import { EXPERIENCE, PROJECTS, SKILLS } from '../data/profile';
import { scrollToId, useApp } from '../context';
import { Reveal, SectionHead } from './Reveal';

export function Skills() {
  const { setSkill } = useApp();
  const usage = useMemo(() => {
    const m: Record<string, number> = {};
    PROJECTS.forEach((p) => p.skills.forEach((s) => (m[s] = (m[s] ?? 0) + 1)));
    return m;
  }, []);
  const inWork = useMemo(() => new Set(EXPERIENCE.flatMap((e) => e.tags)), []);

  const pick = (s: string) => {
    setSkill(s);
    scrollToId('projects');
  };

  return (
    <section className="section" id="skills">
      <div className="container">
        <SectionHead eyebrow="04 / Skills" title="The toolkit." sub="The number next to each skill is how many projects use it. Click one to see those projects." />
        <div className="skills-grid">
          {SKILLS.map((g, gi) => (
            <Reveal key={g.group} delay={gi * 0.06}>
              <div className="card skill-group">
                <h3>
                  {g.group}
                  <span>{String(g.items.length).padStart(2, '0')}</span>
                </h3>
                <div className="skill-list">
                  {g.items.map((s) => {
                    const n = usage[s] ?? 0;
                    return (
                      <button
                        key={s}
                        className="skill"
                        disabled={!n}
                        onClick={() => pick(s)}
                        title={n ? `Show ${n} project${n > 1 ? 's' : ''} using ${s}` : inWork.has(s) ? 'Used at work' : undefined}
                      >
                        {s}
                        {n > 0 && <span className="n">{n}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="skills-hint">
          <MousePointerClick size={15} /> Skills without a number come from work, coursework, or design projects.
        </p>
      </div>
    </section>
  );
}
