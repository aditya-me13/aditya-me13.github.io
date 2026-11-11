import type { ReactNode } from 'react';
import { isPlaceholder } from '../data/profile';

/** Button-styled link; renders a disabled "Coming soon" state while the URL is a placeholder. */
export function DocLink({ href, icon, children, primary }: { href: string; icon?: ReactNode; children: ReactNode; primary?: boolean }) {
  if (isPlaceholder(href)) {
    return (
      <span className="btn" aria-disabled="true" title="Link coming soon">
        {icon}
        {children}
        <small>soon</small>
      </span>
    );
  }
  const external = /^https?:/.test(href);
  return (
    <a className={`btn${primary ? ' btn-primary' : ''}`} href={href} target="_blank" rel={external ? 'noopener noreferrer' : undefined}>
      {icon}
      {children}
    </a>
  );
}
