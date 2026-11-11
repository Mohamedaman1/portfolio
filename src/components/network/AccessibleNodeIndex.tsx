import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { hubs, projects } from '../../data/portfolio';
import { hubNodeId, projectNodeId } from '../../lib/networkLayout';

interface Props {
  open: boolean;
  onClose(): void;
  onSelect(id: string): void;
}

/** DOM alternative to the canvas: every hub and project, reachable by keyboard and touch. */
export default function AccessibleNodeIndex({ open, onClose, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    ref.current?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="node-index" id="node-index" ref={ref} role="region" aria-label="List of all hubs and projects">
      <header>
        <p className="micro">Node index</p>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close list">
          ×
        </button>
      </header>
      <div className="node-index__grid">
        {hubs.map((h) => {
          const items = projects.filter((p) => p.hubs[0] === h.id);
          return (
            <section key={h.id}>
              <button type="button" className="node-index__hub" onClick={() => onSelect(hubNodeId(h.id))}>
                {h.label}
              </button>
              <ul>
                {items.map((p) => (
                  <li key={p.slug}>
                    <button type="button" onClick={() => onSelect(projectNodeId(p.slug))}>
                      {p.name}
                    </button>
                    <Link to={`/work/${p.slug}`} aria-label={`Open case study: ${p.name}`}>
                      ↗
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
