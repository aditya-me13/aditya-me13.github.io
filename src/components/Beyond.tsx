import { BEYOND, QUOTE } from '../data/profile';
import { Reveal, SectionHead } from './Reveal';

export function Beyond() {
  return (
    <section className="section" id="beyond">
      <div className="container">
        <SectionHead eyebrow="08 / Off the clock" title="Outside work." sub="I grew up in Mandvi, a coastal town in Kutch. A Jain by religion, a Gujarati by blood, and Indian at heart." />
        <div className="beyond-grid">
          {BEYOND.map((b, i) => (
            <Reveal key={b.title} delay={(i % 3) * 0.06}>
              <div className="card beyond-item" style={{ height: '100%' }}>
                <span className="e" aria-hidden="true">
                  {b.emoji}
                </span>
                <div>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <blockquote className="quote">{QUOTE}</blockquote>
        </Reveal>
      </div>
    </section>
  );
}
