import { useState } from 'react';
import { Link } from 'react-router-dom';
import { industries, projectBySlug } from '../../data/portfolio';
import Rich from './Rich';

const pad = (n: number) => String(n).padStart(2, '0');

/** Industries first: pick a sector to see the problem it brings and the work done there. */
export default function IndustryExplorer() {
  const [active, setActive] = useState(industries[0].id);
  const ind = industries.find((i) => i.id === active)!;
  const at = industries.indexOf(ind);

  return (
    <div className="industries">
      <div className="industries__list" role="tablist" aria-label="Industries">
        {industries.map((i, n) => (
          <button
            key={i.id}
            type="button"
            role="tab"
            id={`ind-tab-${i.id}`}
            aria-selected={i.id === active}
            aria-controls="ind-panel"
            className={`industry${i.id === active ? ' is-active' : ''}`}
            onClick={() => setActive(i.id)}
          >
            <span className="industry__n">{pad(n + 1)}</span>
            <span className="industry__name">{i.name}</span>
            <span className="industry__market">{i.market}</span>
          </button>
        ))}
      </div>
      <div className="industries__panel" id="ind-panel" role="tabpanel" aria-labelledby={`ind-tab-${ind.id}`} key={ind.id}>
        <p className="micro">
          <span className="gold">{pad(at + 1)}</span> / {pad(industries.length)} · {ind.market}
        </p>
        <h3>{ind.name}</h3>
        <p className="industries__label micro">The challenge</p>
        <p className="industries__challenge">
          <Rich text={ind.challenge} />
        </p>
        <p className="industries__label micro">The work</p>
        <ul className="industries__work">
          {ind.work.map((w, n) => (
            <li key={w} style={{ ['--i' as string]: n }}>
              {w}
            </li>
          ))}
        </ul>
        {ind.note && <p className="note">{ind.note}</p>}
        <div className="industries__links">
          {ind.links.map((slug) => {
            const p = projectBySlug.get(slug);
            if (!p) return null;
            return (
              <Link key={slug} to={`/work/${slug}`} className="industries__link">
                <span className="micro">{p.kind === 'story' ? 'Case study' : p.status}</span>
                <span>{p.alias ?? p.name}</span>
                <span aria-hidden="true">→</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
