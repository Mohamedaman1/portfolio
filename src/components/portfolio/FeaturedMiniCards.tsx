import { featuredAreas, headlineProof, type HubId } from '../../data/portfolio';
import ProjectArt from './ProjectArt';

interface Props {
  /** Hub the journey is currently visiting, if any. */
  activeHub: HubId | null;
  onPick(hub: HubId): void;
}

/** Practice-area cards. Each one travels the journey to its real hub in the network. */
export default function FeaturedMiniCards({ activeHub, onPick }: Props) {
  return (
    <ul className="mini-cards">
      {featuredAreas.map((a, i) => {
        return (
          <li key={a.hub}>
            <button
              type="button"
              className={`mini-card${i === 0 ? ' mini-card--lead' : ''}${activeHub === a.hub ? ' is-active' : ''}`}
              aria-pressed={activeHub === a.hub}
              onClick={() => onPick(a.hub)}
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
