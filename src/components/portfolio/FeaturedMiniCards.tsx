import { featuredAreas, headlineProof } from '../../data/portfolio';
import { hubNodeId } from '../../lib/networkLayout';
import ProjectArt from './ProjectArt';

interface Props {
  selectedId: string | null;
  onPick(id: string): void;
}

/** Practice-area cards. Each one selects and focuses its real hub in the network. */
export default function FeaturedMiniCards({ selectedId, onPick }: Props) {
  return (
    <ul className="mini-cards">
      {featuredAreas.map((a, i) => {
        const id = hubNodeId(a.hub);
        return (
          <li key={a.hub}>
            <button
              type="button"
              className={`mini-card${i === 0 ? ' mini-card--lead' : ''}${selectedId === id ? ' is-active' : ''}`}
              aria-pressed={selectedId === id}
              onClick={() => onPick(id)}
            >
              <span className="mini-card__art">
                <ProjectArt project={{ slug: `area-${a.hub}`, name: a.title, accent: a.accent }} />
                {i === 0 && (
                  <span className="mini-card__stat">
                    <strong>
                      {headlineProof.prefix}
                      {headlineProof.value}
                      {headlineProof.suffix}
                    </strong>
                    <span>{headlineProof.label}</span>
                  </span>
                )}
              </span>
              <span className="mini-card__text">
                <span className="mini-card__name">{a.title}</span>
                <span className="mini-card__meta">{a.meta}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
