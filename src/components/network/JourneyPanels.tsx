import { Link } from 'react-router-dom';
import { hubById, journeyStops } from '../../data/portfolio';

const pad = (n: number) => String(n).padStart(2, '0');

/** One content panel per hub. Their reveal is driven by the journey timeline, not by React state. */
export default function JourneyPanels({ stop }: { stop: number }) {
  return (
    <div className="jpanels">
      {journeyStops.map((s, i) => {
        const hub = hubById.get(s.hub)!;
        return (
          <article className="jpanel" key={s.hub} aria-hidden={stop !== i + 1}>
            <p className="micro jpanel__bit">
              <span className="gold">{pad(i + 1)}</span> / {pad(journeyStops.length)} · {hub.label}
            </p>
            <h2 className="jpanel__bit">{s.headline}</h2>
            {s.stat && (
              <p className="jpanel__stat jpanel__bit">
                <strong>{s.stat.value}</strong>
                <span>{s.stat.label}</span>
              </p>
            )}
            <p className="jpanel__body jpanel__bit">{hub.summary}</p>
            <ul>
              {s.points.map((pt) => (
                <li className="jpanel__bit" key={pt}>
                  {pt}
                </li>
              ))}
            </ul>
            <Link className="btn btn--gold jpanel__bit" to={s.cta.to}>
              {s.cta.label} <span aria-hidden="true">→</span>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
