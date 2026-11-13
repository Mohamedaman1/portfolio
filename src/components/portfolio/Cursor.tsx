import { useEffect, useRef } from 'react';

/**
 * Desktop-only flourish: a gold ring trails the pointer and swells over anything clickable,
 * and cards lean toward the pointer. The system cursor stays, so nothing depends on it.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ring.current;
    if (!el) return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let x = -100;
    let y = -100;
    let tx = x;
    let ty = y;
    let raf = 0;
    let tilted: HTMLElement | null = null;
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.classList.add('is-on');
      const t = e.target as HTMLElement;
      el.classList.toggle('is-link', !!t.closest('a, button, .topic, .mini-card'));
      el.classList.toggle('is-hidden', !!t.closest('.net-canvas'));
      const card = t.closest<HTMLElement>('.card, .face');
      if (tilted && tilted !== card) {
        tilted.style.removeProperty('--rx');
        tilted.style.removeProperty('--ry');
      }
      tilted = card;
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 7).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${((0.5 - (e.clientY - r.top) / r.height) * 7).toFixed(2)}deg`);
      }
    };
    const leave = () => el.classList.remove('is-on');
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  return <div className="cursor" ref={ring} aria-hidden="true" />;
}
