import { Link } from 'react-router-dom';
import { contactLinks, profile } from '../data/portfolio';
import { PRIVACY_UPDATED, privacySections as sections } from '../data/privacy';

export default function Privacy() {
  return (
    <div className="page legal">
      <header className="page__head">
        <p className="micro">
          <span className="gold">Privacy</span> / {profile.name}
        </p>
        <h1>Privacy policy</h1>
        <p className="micro">Last updated {PRIVACY_UPDATED}</p>
      </header>

      <div className="legal__layout">
        <nav className="legal__toc" aria-label="On this page">
          <p className="micro gold">On this page</p>
          <ol>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>
                  <span className="micro">{String(i + 1).padStart(2, '0')}</span> {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="legal__body">
          {sections.map((s, i) => (
            <section id={s.id} key={s.id} className="legal__section">
              <h2>
                <span className="micro gold">{String(i + 1).padStart(2, '0')}</span> {s.title}
              </h2>
              {s.blocks.map((b, n) =>
                'p' in b ? (
                  <p key={n}>{b.p}</p>
                ) : (
                  <ul key={n}>
                    {b.ul.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}

          <section className="legal__section" id="contact">
            <h2>
              <span className="micro gold">09</span> Contact
            </h2>
            <p>Questions about this page, or a request about something you sent me:</p>
            <div className="page__cta">
              {contactLinks.map((l) => (
                <a key={l.label} className="btn btn--gold" href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
              <Link className="btn" to="/contact">
                Contact page <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
