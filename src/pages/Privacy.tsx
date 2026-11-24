import { Link } from 'react-router-dom';
import { contactLinks, profile } from '../data/portfolio';

const UPDATED = '24 November 2026';

const sections = [
  {
    id: 'summary',
    title: 'In short',
    body: (
      <>
        <p>
          This is a personal portfolio. It does not ask for your name or email, has no sign-in, no contact form, no cookies and
          no analytics or advertising trackers. I do not collect, sell or share personal data through this site.
        </p>
      </>
    ),
  },
  {
    id: 'collect',
    title: 'What this site collects',
    body: (
      <>
        <p>Nothing that identifies you. Specifically, the site:</p>
        <ul>
          <li>sets no cookies and uses no local storage;</li>
          <li>
            remembers one thing for the length of your visit, in your browser only: that the opening animation has already played,
            so it does not repeat. It is cleared when you close the tab and is never sent anywhere;
          </li>
          <li>loads its fonts, images and code from the site itself — no third-party fonts, scripts, maps or embeds;</li>
          <li>has no forms, accounts, comments or newsletter.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'hosting',
    title: 'Hosting and technical logs',
    body: (
      <>
        <p>
          The site is served as static files by GitHub Pages, and its domain name is handled by a domain registrar. Like any web
          host, they may process technical data needed to deliver the pages, such as your IP address, browser type and the pages
          requested, in their own server logs. I do not receive or use that data. Their handling is governed by their own policies.
        </p>
      </>
    ),
  },
  {
    id: 'links',
    title: 'Links to other services',
    body: (
      <>
        <p>
          The contact options open WhatsApp and LinkedIn in a new tab. Nothing is sent until you choose to send it there. When you
          use them, that service’s own privacy policy applies, and what you write reaches me through it.
        </p>
        <p>
          The WhatsApp button on the Contact page only opens a chat with a ready-made first line. The text is built in your browser
          and passed in the link; it is not stored or seen by this site, and you can edit it before sending.
        </p>
      </>
    ),
  },
  {
    id: 'messages',
    title: 'If you message me',
    body: (
      <>
        <p>
          If you contact me, I use what you send only to reply and to discuss the work you asked about. I do not add you to a
          mailing list or pass your details on. You can ask me to delete the conversation at any time.
        </p>
      </>
    ),
  },
  {
    id: 'work',
    title: 'Client work shown here',
    body: (
      <>
        <p>
          Projects are described by sector and market, without naming clients, and without patient, customer or account data.
          If you believe something here describes your business and you would like it changed or removed, tell me and I will
          do it.
        </p>
      </>
    ),
  },
  {
    id: 'rights',
    title: 'Your choices',
    body: (
      <>
        <p>
          Because the site holds no personal data about you, there is nothing to access, correct or delete here. For anything you
          have sent me directly, you can ask to see it, correct it or have it deleted.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this page',
    body: (
      <>
        <p>If the site ever starts collecting anything, this page will be updated first. The date at the top shows the latest version.</p>
      </>
    ),
  },
];

export default function Privacy() {
  return (
    <div className="page legal">
      <header className="page__head">
        <p className="micro">
          <span className="gold">Privacy</span> / {profile.name}
        </p>
        <h1>Privacy policy</h1>
        <p className="micro">Last updated {UPDATED}</p>
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
              {s.body}
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
