import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { chapters, profile } from '../../data/portfolio';
import ChapterIndex from './ChapterIndex';

interface Props {
  open: boolean;
  onClose(): void;
}

export default function IndexOverlay({ open, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.classList.add('no-scroll');
    ref.current?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && ref.current) {
        const items = ref.current.querySelectorAll<HTMLElement>('a, button');
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      prev?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="overlay" id="index-overlay" ref={ref} role="dialog" aria-modal="true" aria-label="Index">
      <div className="overlay__head">
        <p className="micro">
          Index {String(chapters.length).padStart(2, '0')} · Portfolio / {profile.year}
        </p>
        <button type="button" className="overlay__close" onClick={onClose}>
          Close ×
        </button>
      </div>
      <ChapterIndex large />
      <div className="overlay__links">
        <Link to="/">The network</Link>
        <Link to="/work">All work</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <p className="micro overlay__foot">{profile.markets}</p>
    </div>
  );
}
