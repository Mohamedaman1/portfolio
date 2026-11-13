import { Link } from 'react-router-dom';
import { contactLinks, profile } from '../../data/portfolio';
import Signature from './Signature';

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer__col">
        <p className="micro">
          {profile.name} — {profile.edition} / {profile.year}
        </p>
        <p className="micro footer__dim">Growth × Creative × Performance · {profile.markets}</p>
        <p className="micro footer__dim">A standalone portfolio. No tracking, no external services.</p>
      </div>
      <nav className="footer__nav" aria-label="Footer">
        <Link to="/">↑ Back to the network</Link>
        <Link to="/work">Work</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        {contactLinks.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
            {l.label} ↗
          </a>
        ))}
      </nav>
      <Signature />
    </footer>
  );
}
