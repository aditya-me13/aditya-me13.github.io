import { useEffect, useRef } from 'react';

type P = { x: number; y: number; vx: number; vy: number; r: number };

/**
 * "Market data field": drifting nodes that link up and bend away from the cursor,
 * with slow random-walk price lines tracing across the background.
 */
export function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0,
      h = 0,
      dpr = 1,
      raf = 0,
      running = true;
    let pts: P[] = [];
    let series: { pts: number[]; color: 'dot' | 'amber'; base: number; vol: number }[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let dot = '62,230,168',
      line = '120,140,160',
      amber = '255,181,71';

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      dot = cs.getPropertyValue('--field-dot').trim() || dot;
      line = cs.getPropertyValue('--field-line').trim() || line;
      amber = document.documentElement.dataset.theme === 'light' ? '178,106,0' : '255,181,71';
    };

    const walk = (n: number, base: number, vol: number) => {
      const out: number[] = [];
      let v = base;
      for (let i = 0; i < n; i++) {
        v += (Math.random() - 0.48) * vol;
        v = Math.max(h * 0.15, Math.min(h * 0.9, v));
        out.push(v);
      }
      return out;
    };

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(120, (w * h) / (w < 640 ? 14000 : 11000)));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6,
      }));
      const steps = Math.ceil(w / 6) + 2;
      series = [
        { pts: walk(steps, h * 0.62, 7), color: 'dot', base: h * 0.62, vol: 7 },
        { pts: walk(steps, h * 0.45, 5), color: 'amber', base: h * 0.45, vol: 5 },
      ];
    };

    const LINK = 130;
    const R = 150;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      frame++;

      // price lines
      series.forEach((s, si) => {
        if (!reduce && frame % (si ? 5 : 4) === 0) {
          s.pts.shift();
          const last = s.pts[s.pts.length - 1];
          let nv = last + (Math.random() - 0.49) * s.vol + (s.base - last) * 0.01;
          nv = Math.max(h * 0.15, Math.min(h * 0.9, nv));
          s.pts.push(nv);
        }
        const c = s.color === 'dot' ? dot : amber;
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, `rgba(${c},0)`);
        grad.addColorStop(0.6, `rgba(${c},0.18)`);
        grad.addColorStop(1, `rgba(${c},0.5)`);
        ctx.beginPath();
        s.pts.forEach((v, i) => (i ? ctx.lineTo(i * 6, v) : ctx.moveTo(0, v)));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        // area fill
        ctx.lineTo((s.pts.length - 1) * 6, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const fill = ctx.createLinearGradient(0, h * 0.3, 0, h);
        fill.addColorStop(0, `rgba(${c},0.05)`);
        fill.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = fill;
        ctx.fill();
        // last-price marker
        const lx = (s.pts.length - 1) * 6;
        const ly = s.pts[s.pts.length - 1];
        if (lx > w - 10) {
          ctx.beginPath();
          ctx.arc(w - 4, ly, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c},0.9)`;
          ctx.fill();
        }
      });

      // nodes
      for (const p of pts) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < R && d > 0.1) {
            const f = (1 - d / R) * 2.2;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
        }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(${line},${(1 - d / LINK) * 0.22})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        let glow = 0.35;
        if (mouse.active) {
          const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (dm < R * 1.4) {
            glow = 0.35 + (1 - dm / (R * 1.4)) * 0.65;
            ctx.strokeStyle = `rgba(${dot},${(1 - dm / (R * 1.4)) * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dot},${glow})`;
        ctx.fill();
      }

      if (running && !reduce) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = mouse.y >= 0 && mouse.y <= r.height;
      if (reduce) draw();
    };
    const onLeave = () => (mouse.active = false);
    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(() => {
        init();
        if (reduce) draw();
      }, 120);
    };

    readColors();
    init();
    draw();

    const mo = new MutationObserver(() => {
      readColors();
      if (reduce) draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const io = new IntersectionObserver(([e]) => {
      const was = running;
      running = e.isIntersecting;
      if (running && !was && !reduce) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
