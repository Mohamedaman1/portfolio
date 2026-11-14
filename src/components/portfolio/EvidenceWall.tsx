import { Link } from 'react-router-dom';
import { evidence, projectBySlug } from '../../data/portfolio';
import CountUp from './CountUp';

/** Figures from the work, with their context and caveats, and no client names. */
export default function EvidenceWall() {
  return (
    <div className="evidence">
      <p className="micro evidence__label">
        <span className="gold">Evidence from the work</span> — shared without client names
      </p>
      <ul className="evidence__grid">
        {evidence.map((e) => {
          const story = e.story ? projectBySlug.get(e.story) : undefined;
          return (
            <li className="evidence__card" key={e.label}>
              <strong className="evidence__value">
                <CountUp value={e.value} prefix={e.prefix} suffix={e.suffix} decimals={e.decimals} />
              </strong>
              <span className="evidence__what">{e.label}</span>
              <span className="micro evidence__context">{e.context}</span>
              {e.caveat && <span className="evidence__caveat">{e.caveat}</span>}
              {story && (
                <Link className="evidence__link micro" to={`/work/${story.slug}`}>
                  {story.name} <span aria-hidden="true">→</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
