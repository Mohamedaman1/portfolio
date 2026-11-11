import { Link } from 'react-router-dom';
import type { Project } from '../../data/portfolio';
import ProjectArt from './ProjectArt';

export default function ProjectCard({ project, n }: { project: Project; n?: string }) {
  return (
    <Link className="card" to={`/work/${project.slug}`}>
      <span className="card__art">
        <ProjectArt project={project} />
      </span>
      <span className="card__body">
        <span className="micro card__top">
          {n && <span className="card__n">{n}</span>}
          <span>{project.status}</span>
        </span>
        <span className="card__title">{project.name}</span>
        <span className="card__summary">{project.summary}</span>
        <span className="micro card__meta">
          {project.market} · {project.sector}
        </span>
      </span>
    </Link>
  );
}
