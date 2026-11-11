import { AnimatePresence } from 'framer-motion';
import { ArrowRight, Copy, FileText, FolderGit2, GraduationCap, Hash, Mail, Moon, ScrollText, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DEGREE_URL, PROFILE, PROJECTS, RESUME_URL, SECTIONS, SOCIALS, TRANSCRIPT_URL, isPlaceholder } from '../data/profile';
import { scrollToId, useApp } from '../context';
import { Overlay } from './Modal';
import { SOCIAL_ICON } from './Contact';

type Item = { id: string; group: string; label: string; icon: ReactNode; hint?: string; disabled?: boolean; keywords?: string; run: () => void };

function score(q: string, text: string): number {
  if (!q) return 1;
  const t = text.toLowerCase();
  const idx = t.indexOf(q);
  if (idx >= 0) {
    const wordStart = idx === 0 || /[\s\-·(]/.test(t[idx - 1]);
    return (wordStart ? 200 : 100) - idx;
  }
  let ti = 0;
  for (const ch of q) {
    ti = t.indexOf(ch, ti);
    if (ti < 0) return 0;
    ti++;
  }
  return 10;
}

const openUrl = (u: string) => window.open(u, '_blank', 'noopener,noreferrer');

export function CommandPalette({ onToggleTheme }: { onToggleTheme: () => void }) {
  const { paletteOpen, setPaletteOpen, copyEmail, setProjectId, setSkill } = useApp();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      } else if (e.key === '/' && !typing && !paletteOpen) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, setPaletteOpen]);

  useEffect(() => {
    if (paletteOpen) {
      setQ('');
      setSel(0);
    }
  }, [paletteOpen]);

  const items: Item[] = useMemo(() => {
    const close = () => setPaletteOpen(false);
    const doc = (id: string, label: string, url: string, icon: ReactNode): Item => ({
      id,
      group: 'Documents',
      label,
      icon,
      hint: isPlaceholder(url) ? 'coming soon' : 'opens in new tab',
      disabled: isPlaceholder(url),
      run: () => {
        if (isPlaceholder(url)) return;
        close();
        openUrl(url);
      },
    });
    return [
      ...[{ id: 'top', label: 'Home' }, ...SECTIONS, { id: 'beyond', label: 'Off the clock' }].map<Item>((s) => ({
        id: `go-${s.id}`,
        group: 'Navigate',
        label: s.label,
        icon: <Hash size={16} />,
        hint: 'jump',
        run: () => {
          close();
          setTimeout(() => scrollToId(s.id), 60);
        },
      })),
      doc('resume', 'Résumé (PDF)', RESUME_URL, <FileText size={16} />),
      doc('degree', 'Degree certificate', DEGREE_URL, <GraduationCap size={16} />),
      doc('transcript', 'Transcript', TRANSCRIPT_URL, <ScrollText size={16} />),
      ...PROJECTS.map<Item>((p) => ({
        id: `p-${p.id}`,
        group: 'Projects',
        label: p.title,
        keywords: `${p.category} ${p.skills.join(' ')}`,
        icon: <FolderGit2 size={16} />,
        hint: p.category,
        run: () => {
          close();
          setSkill(null);
          scrollToId('projects');
          setTimeout(() => setProjectId(p.id), 350);
        },
      })),
      { id: 'copy', group: 'Actions', label: 'Copy email address', icon: <Copy size={16} />, hint: PROFILE.email, run: () => (close(), copyEmail()) },
      { id: 'mail', group: 'Actions', label: 'Send an email', icon: <Mail size={16} />, run: () => (close(), (window.location.href = `mailto:${PROFILE.email}`)) },
      { id: 'theme', group: 'Actions', label: 'Toggle light / dark theme', icon: <Moon size={16} />, keywords: 'mode color', run: () => (close(), onToggleTheme()) },
      ...SOCIALS.map<Item>((s) => ({
        id: `s-${s.id}`,
        group: 'Social',
        label: s.label,
        icon: SOCIAL_ICON[s.id],
        hint: `@${s.handle}`,
        run: () => (close(), openUrl(s.url)),
      })),
    ];
  }, [setPaletteOpen, copyEmail, onToggleTheme, setProjectId, setSkill]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items
      .map((it) => ({ it, s: Math.max(score(query, it.label), score(query, `${it.group} ${it.keywords ?? ''}`) * 0.5) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => (query ? b.s - a.s : 0))
      .map((r) => r.it);
  }, [q, items]);

  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${sel}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel((s) => Math.min(results.length - 1, s + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      results[sel]?.run();
    }
  };

  let lastGroup = '';
  return (
    <AnimatePresence>
      {paletteOpen && (
        <Overlay onClose={() => setPaletteOpen(false)} className="palette-wrap" labelledBy="palette-label">
          <div className="card palette">
            <div className="palette-input">
              <Search size={18} />
              <label id="palette-label" className="sr-only" htmlFor="palette-q">
                Search the site
              </label>
              <input
                id="palette-q"
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search sections, projects, documents…"
                autoComplete="off"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[sel] ? `pi-${results[sel].id}` : undefined}
              />
              <span className="kbd">esc</span>
            </div>
            <div className="palette-list" id="palette-list" role="listbox" ref={listRef}>
              {results.length === 0 && <div className="palette-empty">No results for “{q}”</div>}
              {results.map((it, i) => {
                const header = it.group !== lastGroup && !q.trim();
                lastGroup = it.group;
                return (
                  <div key={it.id}>
                    {header && <div className="palette-group">{it.group}</div>}
                    <button
                      id={`pi-${it.id}`}
                      data-idx={i}
                      role="option"
                      aria-selected={sel === i}
                      aria-disabled={it.disabled || undefined}
                      tabIndex={-1}
                      className={`palette-item${sel === i ? ' sel' : ''}`}
                      onMouseMove={() => sel !== i && setSel(i)}
                      onClick={it.run}
                    >
                      {it.icon}
                      {it.label}
                      {it.hint && <span className="hint">{it.hint}</span>}
                      {sel === i && !it.hint && <ArrowRight size={14} style={{ marginLeft: 'auto' }} />}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="palette-foot">
              <span>
                <span className="kbd">↑</span>
                <span className="kbd">↓</span> navigate
              </span>
              <span>
                <span className="kbd">↵</span> select
              </span>
              <span>
                <span className="kbd">esc</span> close
              </span>
            </div>
          </div>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
