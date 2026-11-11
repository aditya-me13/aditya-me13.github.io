import { Code2, Copy, Github, Instagram, Linkedin, Send } from 'lucide-react';
import { PROFILE, SOCIALS } from '../data/profile';
import { useApp } from '../context';
import { Reveal } from './Reveal';

export const SOCIAL_ICON: Record<string, JSX.Element> = {
  github: <Github size={16} />,
  linkedin: <Linkedin size={16} />,
  leetcode: <Code2 size={16} />,
  instagram: <Instagram size={16} />,
  telegram: <Send size={16} />,
};

export function Contact() {
  const { copyEmail } = useApp();
  return (
    <>
      <section className="section contact" id="contact">
        <div className="grid-bg" />
        <div className="container contact-inner">
          <Reveal>
            <span className="eyebrow">09 / Contact</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2>
              Let’s talk<span>.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Quant, ML, a problem you’re stuck on, or just to say hi: my inbox is open.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <button className="email-btn" onClick={copyEmail} aria-label={`Copy email address ${PROFILE.email}`}>
              <span className="addr">{PROFILE.email}</span>
              <span className="cp">
                <Copy size={16} />
              </span>
            </button>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="socials">
              {SOCIALS.map((s) => (
                <a key={s.id} className="social" href={s.url} target="_blank" rel="noopener noreferrer">
                  {SOCIAL_ICON[s.id]} {s.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <footer className="footer">
        <div className="container footer-inner">
          <span>
            © {new Date().getFullYear()} {PROFILE.name}. Designed &amp; built from scratch.
          </span>
          <span className="mono">
            Press <span className="kbd">/</span> to search the site
          </span>
        </div>
      </footer>
    </>
  );
}
