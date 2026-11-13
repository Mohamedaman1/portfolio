import { Link } from 'react-router-dom';
import { contactLinks, profile } from '../data/portfolio';

export default function Contact() {
  return (
    <div className="page page--contact">
      <header className="page__head">
        <p className="micro">
          <span className="gold">Contact</span> / {profile.markets}
        </p>
        <h1>{profile.contactLine}</h1>
        <p className="arabic" lang="ar" dir="rtl">
          {profile.contactArabic}
        </p>
      </header>
      {contactLinks.length ? (
        <ul className="rows rows--static">
          {contactLinks.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">
                <span className="rows__name">{l.label}</span>
                <span className="rows__desc">{l.value}</span>
                <span className="status">Open ↗</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="note">
          Direct contact details will be listed here once they are confirmed for publication.
        </p>
      )}
      <p className="note">These are plain links. This portfolio has no contact form and sends nothing to any service.</p>
      <div className="page__cta">
        <Link className="btn" to="/work">
          See the work <span aria-hidden="true">→</span>
        </Link>
        <Link className="btn" to="/">
          Back to the network <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
