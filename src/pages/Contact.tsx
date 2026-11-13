import { Link } from 'react-router-dom';
import ContactComposer from '../components/portfolio/ContactComposer';
import { contactLinks, profile } from '../data/portfolio';
import { candidUrl, illustrationUrl } from '../lib/portrait';

export default function Contact() {
  return (
    <div className="page contact">
      <header className="page__head contact__head">
        <p className="micro">
          <span className="gold">Contact</span> / {profile.markets}
        </p>
        <h1 className="contact__title">
          <span>The next</span> <span>growth story</span> <span className="gold">could be yours.</span>
        </h1>
        <p className="lede lede--narrow">
          <mark className="hl">One message</mark> is all it takes to start. Pick what you need and the first line is{' '}
          <mark className="hl">written for you</mark>.
        </p>
        {(candidUrl || illustrationUrl) && (
          <div className="contact__faces" aria-label="Mohamed Aman">
            {illustrationUrl && (
              <figure className="face face--back">
                <img src={illustrationUrl} alt="Illustrated portrait of Mohamed Aman" width="800" height="1096" />
              </figure>
            )}
            {candidUrl && (
              <figure className="face face--front">
                <img src={candidUrl} alt="Mohamed Aman smiling and giving a thumbs up" width="1000" height="1333" />
                <figcaption className="micro">On the other end of the message</figcaption>
              </figure>
            )}
          </div>
        )}
      </header>

      <ContactComposer />

      <ol className="contact__steps">
        <li className="rv">
          <span className="micro gold">01</span>
          <strong>You send one message</strong>
          <span>Say what the business is and what you want to change.</span>
        </li>
        <li className="rv">
          <span className="micro gold">02</span>
          <strong>We look at the whole path</strong>
          <span>Offer, traffic, storefront and follow-up — not just the ads.</span>
        </li>
        <li className="rv">
          <span className="micro gold">03</span>
          <strong>You get a clear next step</strong>
          <span>What to fix first, and what it should lead to.</span>
        </li>
      </ol>

      <ul className="rows rows--static contact__links">
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
      <p className="note">These are plain links. This portfolio has no contact form and sends nothing to any service.</p>
      <div className="page__cta">
        <Link className="btn" to="/work">
          See the work first <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
