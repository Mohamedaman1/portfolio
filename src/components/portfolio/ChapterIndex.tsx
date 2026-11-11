import { Link } from 'react-router-dom';
import { chapters } from '../../data/portfolio';

export default function ChapterIndex({ large = false }: { large?: boolean }) {
  return (
    <ol className={`chapters${large ? ' chapters--large' : ''}`}>
      {chapters.map((c) => (
        <li key={c.id}>
          <Link to={`/#${c.id}`}>
            <span className="chapters__n">{c.n}</span>
            <span className="chapters__label">{c.label}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
