import { Briefcase, MapPin } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { CURRENT_ROLE, PROFILE, filled } from '../data/profile';
import { useCountUp } from '../hooks/useCountUp';
import { Reveal, SectionHead } from './Reveal';

function Fact({ n, dec = 0, suffix = '', label }: { n: number; dec?: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const v = useCountUp(n, inView);
  return (
    <div className="fact" ref={ref}>
      <div className="n">
        {v.toFixed(dec)}
        {suffix}
      </div>
      <div className="l">{label}</div>
    </div>
  );
}

export function About() {
  const role = [filled(CURRENT_ROLE.title), filled(CURRENT_ROLE.team)].filter(Boolean).join(' · ');
  const where = filled(CURRENT_ROLE.location);
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHead eyebrow="01 / About" title="Engineer by training, quant at heart." />
        <div className="about-grid">
          <Reveal className="about-text">
            {PROFILE.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="about-facts">
              <Fact n={9.41} dec={2} label="Graduating CPI" />
              <Fact n={10} suffix="+" label="Engineering projects" />
              <Fact n={100} suffix="+" label="People led at Blithchron" />
            </div>
          </Reveal>
          <Reveal className="about-side" delay={0.12}>
            <div className="photo-wrap">
              <img src={PROFILE.photo} alt={`Portrait of ${PROFILE.name}`} loading="lazy" width={720} height={900} />
              <span className="photo-tag mono">
                <MapPin size={11} style={{ display: 'inline', verticalAlign: '-1px' }} /> from {PROFILE.hometown}
              </span>
            </div>
            <div className="card now-card">
              <div className="badge">
                <Briefcase size={20} />
              </div>
              <div>
                <div className="t">Now at Barclays</div>
                <div className="s">{[role, where].filter(Boolean).join(' · ') || 'Full-time, since graduating in 2026'}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
