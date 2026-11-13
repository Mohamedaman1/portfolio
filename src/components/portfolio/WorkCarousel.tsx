import { useCallback, useEffect, useRef, useState } from 'react';
import type { Project } from '../../data/portfolio';
import ProjectCard from './ProjectCard';

/** Horizontal, snap-scrolling case-study rail with arrow buttons, arrow keys and a counter. */
export default function WorkCarousel({ items }: { items: Project[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  const step = () => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + 1 : 0;
  };
  const go = useCallback((dir: number) => {
    track.current?.scrollBy({ left: dir * step(), behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const on = () => {
      const s = step();
      setIndex(s ? Math.min(items.length - 1, Math.round(el.scrollLeft / s)) : 0);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    on();
    el.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      el.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, [items.length]);

  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div
      className="carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured case studies"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        else if (e.key === 'ArrowLeft') go(-1);
        else return;
        e.preventDefault();
      }}
    >
      <div className="carousel__track" ref={track} tabIndex={0} aria-label="Case studies — use the arrow keys to move">
        {items.map((p, i) => (
          <div className="carousel__slide" key={p.slug}>
            <ProjectCard project={p} n={pad(i + 1)} />
          </div>
        ))}
      </div>
      <div className="carousel__bar">
        <p className="micro carousel__count" aria-live="polite">
          <span className="gold">{pad(index + 1)}</span> / {pad(items.length)}
        </p>
        <div className="carousel__progress" aria-hidden="true">
          <i style={{ transform: `scaleX(${(index + 1) / items.length})` }} />
        </div>
        <div className="arrows">
          <button type="button" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous case study">
            ←
          </button>
          <button type="button" onClick={() => go(1)} disabled={atEnd} aria-label="Next case study">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
