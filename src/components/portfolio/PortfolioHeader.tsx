import { Link, NavLink } from 'react-router-dom';
import { chapters, profile } from '../../data/portfolio';

interface Props {
  indexOpen: boolean;
  onToggleIndex(): void;
}

export default function PortfolioHeader({ indexOpen, onToggleIndex }: Props) {
  return (
    <header className="header">
      <Link className="header__brand" to="/" aria-label={`${profile.name} — ${profile.edition}, home`}>
        <span className="header__mark">MA</span>
        <span className="header__edition">
          <span aria-hidden="true">/</span> {profile.edition}
        </span>
      </Link>
      <nav className="header__nav" aria-label="Primary">
        <NavLink to="/work">Work</NavLink>
        <Link to="/#expertise">Expertise</Link>
        <NavLink to="/about">About</NavLink>
      </nav>
      <div className="header__actions">
        <button
          type="button"
          className="header__index"
          onClick={onToggleIndex}
          aria-expanded={indexOpen}
          aria-controls="index-overlay"
        >
          Index <span>{String(chapters.length).padStart(2, '0')}</span>
        </button>
        <NavLink className="header__contact" to="/contact">
          Contact
        </NavLink>
      </div>
    </header>
  );
}
