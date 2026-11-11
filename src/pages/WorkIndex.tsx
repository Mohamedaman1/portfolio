import { useMemo, useState } from 'react';
import ProjectCard from '../components/portfolio/ProjectCard';
import { categories, projects, type Category } from '../data/portfolio';

export default function WorkIndex() {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [query, setQuery] = useState('');

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (filter === 'All' || p.category === filter) &&
        (!q || [p.name, p.summary, p.market, p.sector, p.role, p.status].join(' ').toLowerCase().includes(q)),
    );
  }, [filter, query]);

  return (
    <div className="page">
      <header className="page__head">
        <p className="micro">
          <span className="gold">Work</span> / Directory
        </p>
        <h1>All work</h1>
        <p className="lede lede--narrow">Brands, practices, case studies and internal concepts — every entry in the network.</p>
      </header>
      <div className="filters">
        <div role="group" aria-label="Filter by category" className="filters__tabs">
          {(['All', ...categories] as const).map((c) => (
            <button key={c} type="button" className={`chip${filter === c ? ' is-active' : ''}`} aria-pressed={filter === c} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="micro">Search</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, market, sector…" />
        </label>
      </div>
      <p className="micro" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'entry' : 'entries'}
      </p>
      {shown.length ? (
        <div className="cards">
          {shown.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      ) : (
        <p className="note">Nothing matches that search. Clear it or choose another category.</p>
      )}
    </div>
  );
}
