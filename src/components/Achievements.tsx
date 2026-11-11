import { Award, BadgeCheck, GraduationCap, Medal, Trophy, ArrowUpRight } from 'lucide-react';
import { ACHIEVEMENTS, type Achievement } from '../data/profile';
import { Reveal, SectionHead } from './Reveal';

const ICON: Record<Achievement['kind'], JSX.Element> = {
  academic: <GraduationCap size={18} />,
  scholarship: <Award size={18} />,
  rank: <Medal size={18} />,
  cert: <BadgeCheck size={18} />,
  misc: <Trophy size={18} />,
};

export function Achievements() {
  return (
    <section className="section" id="achievements">
      <div className="container">
        <SectionHead eyebrow="07 / Achievements" title="Honours & certifications." />
        <div className="ach-grid">
          {ACHIEVEMENTS.map((a, i) => {
            const inner = (
              <>
                <span className={`ic ${a.kind}`}>{ICON[a.kind]}</span>
                <h3>
                  {a.title}
                  {a.url && <ArrowUpRight size={15} />}
                </h3>
                <p>{a.detail}</p>
              </>
            );
            return (
              <Reveal key={a.title} delay={(i % 4) * 0.05}>
                {a.url ? (
                  <a className="card ach" href={a.url} target="_blank" rel="noopener noreferrer" style={{ height: '100%' }}>
                    {inner}
                  </a>
                ) : (
                  <div className="card ach" style={{ height: '100%' }}>
                    {inner}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
