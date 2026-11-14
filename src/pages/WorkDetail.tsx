import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProjectArt from '../components/portfolio/ProjectArt';
import Rich from '../components/portfolio/Rich';
import ProjectCard from '../components/portfolio/ProjectCard';
import { hubById, projectBySlug, projects, skillById } from '../data/portfolio';
import NotFound from './NotFound';

export default function WorkDetail() {
  const { slug = '' } = useParams();
  const p = projectBySlug.get(slug);
  const navigate = useNavigate();

  useEffect(() => {
    if (p) document.title = `${p.name} — Mohamed Aman`;
  }, [p]);

  if (!p) return <NotFound />;

  const i = projects.indexOf(p);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const relatedSlugs = new Set<string>(p.related ?? []);
  for (const q of projects) if (q.related?.includes(p.slug)) relatedSlugs.add(q.slug);
  if (relatedSlugs.size < 2)
    for (const q of projects) {
      if (relatedSlugs.size >= 3) break;
      if (q !== p && q.hubs[0] === p.hubs[0]) relatedSlugs.add(q.slug);
    }
  const related = [...relatedSlugs].map((s) => projectBySlug.get(s)!).slice(0, 4);

  return (
    <article className="page case">
      <nav className="backbar" aria-label="Case study navigation">
        <button
          type="button"
          className="backbar__back"
          onClick={() => {
            // Go back if the visitor came from inside the site; otherwise to the work directory.
            if ((window.history.state as { idx?: number } | null)?.idx) navigate(-1);
            else navigate('/work');
          }}
        >
          <span aria-hidden="true">←</span> Back
        </button>
        <p className="micro backbar__crumbs">
          <Link to="/work">All work</Link> / {p.category} / <span>{p.name}</span>
        </p>
        <div className="arrows">
          <Link to={`/work/${prev.slug}`} aria-label={`Previous: ${prev.name}`}>
            ←
          </Link>
          <Link to={`/work/${next.slug}`} aria-label={`Next: ${next.name}`}>
            →
          </Link>
        </div>
      </nav>
      <header className="case__hero">
        <div className="case__title">
          <p className="micro">
            <Link to="/work">Work</Link> / {p.category}
          </p>
          <h1>{p.name}</h1>
          <p className="status">{p.status}</p>
          <p className="lede">
            <Rich text={p.summary} />
          </p>
        </div>
        <div className="case__art">
          <ProjectArt project={p} label={p.sector} />
        </div>
      </header>

      <dl className="case__meta">
        <div>
          <dt>Role</dt>
          <dd>{p.role}</dd>
        </div>
        <div>
          <dt>Market</dt>
          <dd>{p.market}</dd>
        </div>
        <div>
          <dt>Sector</dt>
          <dd>{p.sector}</dd>
        </div>
        <div>
          <dt>Practice areas</dt>
          <dd>{p.hubs.map((h) => hubById.get(h)!.label).join(' · ')}</dd>
        </div>
      </dl>

      <div className="case__body">
        <section>
          <h2>The brief</h2>
          <p>{p.challenge}</p>
        </section>
        <section>
          <h2>Approach</h2>
          <ol>
            {p.approach.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
        </section>
        <section>
          <h2>Deliverables</h2>
          <ul>
            {p.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
        {p.outcomes && p.outcomes.length > 0 && (
          <section>
            <h2>What changed</h2>
            <ul className="delivered">
              {p.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </section>
        )}
        {p.results && p.results.length > 0 && (
          <section className="case__results">
            <h2>In numbers</h2>
            <ul>
              {p.results.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        )}
        <section>
          <h2>Capabilities</h2>
          <ul className="tags">
            {p.skills.map((s) => (
              <li key={s}>{skillById.get(s)?.label ?? s}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="case__gallery" aria-label="Deliverables">
        <h2>Deliverables</h2>
        <div className="gallery">
          {p.deliverables.slice(0, 3).map((d, n) => (
            <figure key={d}>
              <ProjectArt project={{ ...p, slug: `${p.slug}-${n}` }} label={`${String(n + 1).padStart(2, '0')} · ${d}`} />
              <figcaption className="micro">{d}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="case__related">
          <h2>Related</h2>
          <div className="cards">
            {related.map((r) => (
              <ProjectCard key={r.slug} project={r} />
            ))}
          </div>
        </section>
      )}

      <nav className="case__pager" aria-label="More work">
        <Link to={`/work/${prev.slug}`}>
          <span className="micro">← Previous</span>
          <span>{prev.name}</span>
        </Link>
        <Link to={`/work/${next.slug}`}>
          <span className="micro">Next →</span>
          <span>{next.name}</span>
        </Link>
      </nav>
    </article>
  );
}
