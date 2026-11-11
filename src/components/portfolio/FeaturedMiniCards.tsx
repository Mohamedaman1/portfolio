import { miniCardSlugs, projectBySlug } from '../../data/portfolio';
import { projectNodeId } from '../../lib/networkLayout';
import ProjectArt from './ProjectArt';

interface Props {
  selectedId: string | null;
  onPick(id: string): void;
}

/** Compact editorial cards. Each one selects and focuses its real node in the network. */
export default function FeaturedMiniCards({ selectedId, onPick }: Props) {
  return (
    <ul className="mini-cards">
      {miniCardSlugs.map((slug, i) => {
        const p = projectBySlug.get(slug)!;
        const id = projectNodeId(slug);
        return (
          <li key={slug}>
            <button
              type="button"
              className={`mini-card${i === 0 ? ' mini-card--lead' : ''}${selectedId === id ? ' is-active' : ''}`}
              aria-pressed={selectedId === id}
              onClick={() => onPick(id)}
            >
              <span className="mini-card__art">
                <ProjectArt project={p} />
              </span>
              <span className="mini-card__text">
                <span className="mini-card__name">{p.name}</span>
                <span className="mini-card__meta">
                  {p.market} · {p.sector}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
