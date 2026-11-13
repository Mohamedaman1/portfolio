import { Link } from 'react-router-dom';
import Rich from '../portfolio/Rich';
import type { NodeDetail } from './describe';

interface Props {
  detail: NodeDetail | null;
  onSelect(id: string | null): void;
}

export default function NetworkInspector({ detail, onSelect }: Props) {
  if (!detail) {
    return (
      <aside className="inspector inspector--empty" aria-label="Node inspector">
        <p className="micro">Inspector</p>
        <p className="inspector__hint">Select a hub or project to read what the work was.</p>
      </aside>
    );
  }
  const shown = detail.connections.slice(0, 9);
  return (
    <aside className="inspector" aria-label="Node inspector" aria-live="polite">
      <header className="inspector__head">
        <p className="micro micro--gold">{detail.kindLabel}</p>
        <button type="button" className="icon-btn" onClick={() => onSelect(null)} aria-label="Close details">
          ×
        </button>
      </header>
      <h2 className="inspector__title">{detail.title}</h2>
      {detail.status && <p className="status">{detail.status}</p>}
      {detail.meta.length > 0 && (
        <dl className="inspector__meta">
          {detail.meta.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className="inspector__summary">
        <Rich text={detail.summary} />
      </p>
      {detail.href && (
        <Link className="btn btn--gold" to={detail.href}>
          {detail.hrefLabel} <span aria-hidden="true">→</span>
        </Link>
      )}
      {shown.length > 0 && (
        <div className="inspector__links">
          <p className="micro">Connected</p>
          <ul>
            {shown.map((c) => (
              <li key={c.id}>
                <button type="button" className={`chip chip--${c.kind}`} onClick={() => onSelect(c.id)}>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
