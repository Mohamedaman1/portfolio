import { useEffect, useState } from 'react';
import { chapters } from '../../data/portfolio';

/**
 * Floating chapter navigator for the editorial part of the home page:
 * shows where you are (03 / 07), a progress line, and ↑ ↓ arrows that turn to the previous / next chapter.
 */
export default function ChapterRail() {
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const mark = window.innerHeight * 0.4;
      let current = -1;
      chapters.forEach((c, i) => {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= mark) current = i;
      });
      setActive(current);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);

  const go = (i: number) => {
    if (i < 0) window.scrollTo({ top: 0 });
    else document.getElementById(chapters[i].id)?.scrollIntoView();
  };
  const visible = active >= 0;
  const c = chapters[Math.max(0, active)];

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <i style={{ transform: `scaleX(${progress})` }} />
      </div>
      <nav className={`rail${visible ? ' is-visible' : ''}`} aria-label="Chapter navigation" aria-hidden={!visible}>
        <p className="micro rail__where">
          <span className="gold">{c.n}</span> / {String(chapters.length).padStart(2, '0')}
          <span className="rail__label">{c.label}</span>
        </p>
        <div className="arrows">
          <button type="button" tabIndex={visible ? 0 : -1} onClick={() => go(active - 1)} aria-label={active <= 0 ? 'Back to the network' : 'Previous chapter'}>
            ↑
          </button>
          <button
            type="button"
            tabIndex={visible ? 0 : -1}
            onClick={() => go(active + 1)}
            disabled={active >= chapters.length - 1}
            aria-label="Next chapter"
          >
            ↓
          </button>
        </div>
      </nav>
    </>
  );
}
