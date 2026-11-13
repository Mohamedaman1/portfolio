import { Link } from 'react-router-dom';
import Portrait from '../components/portfolio/Portrait';
import Signature from '../components/portfolio/Signature';
import { expertise, hubs, profile } from '../data/portfolio';
import { candidUrl, illustrationUrl } from '../lib/portrait';

export default function About() {
  return (
    <div className="page">
      <header className="page__head">
        <p className="micro">
          <span className="gold">About</span> / {profile.name}
        </p>
        <h1>{profile.aboutAngle}</h1>
      </header>
      <div className="intro">
        <Portrait />
        <div className="intro__text">
          <p className="lede">{profile.intro}</p>
          <p>
            Mohamed Aman has spent {profile.experience} in growth and marketing — planning strategy, managing marketing, buying
            media and directing creative. The work spans premium Saudi and GCC e-commerce, selected UAE campaigns and local
            Egyptian services, much of it through Viral Social Media Services.
          </p>
          <p>
            The through-line is a habit of looking past the ad. A campaign is only as good as the page it lands on, the
            conversation that follows and the operation that fulfils the order — so those are part of the brief too.
          </p>
          <ul className="tags">
            {profile.roles.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <Signature />
        </div>
      </div>

      {(illustrationUrl || candidUrl) && (
        <section className="chapter chapter--flush">
          <h2>Off the record</h2>
          <div className="sides">
            {illustrationUrl && (
              <figure className="rv">
                <img src={illustrationUrl} alt="Illustrated portrait of Mohamed Aman in round sunglasses" loading="lazy" width="800" height="1096" />
                <figcaption className="micro">The illustrated version</figcaption>
              </figure>
            )}
            {candidUrl && (
              <figure className="rv">
                <img src={candidUrl} alt="Mohamed Aman in sunglasses, smiling and giving a thumbs up" loading="lazy" width="1000" height="1333" />
                <figcaption className="micro">Between campaigns</figcaption>
              </figure>
            )}
            <p className="lede">
              Serious about the numbers, relaxed about everything else. Good marketing is made by people — it helps to be one.
            </p>
          </div>
        </section>
      )}

      <section className="chapter chapter--flush">
        <h2>How the work is approached</h2>
        <div className="principles">
          <article>
            <h3>Start from the customer’s path</h3>
            <p>Map what a customer sees from first impression to delivery, then decide where media, creative and UX should carry the weight.</p>
          </article>
          <article>
            <h3>Hold a standard</h3>
            <p>Premium brands are judged on detail. Creative, storefront and messaging are held to the same level.</p>
          </article>
          <article>
            <h3>Say only what is true</h3>
            <p>Especially in healthcare: explain the service, target responsibly, and make no promise that cannot be kept.</p>
          </article>
        </div>
      </section>

      <section className="chapter chapter--flush">
        <h2>Sectors</h2>
        <ul className="rows rows--static">
          {hubs
            .filter((h) => h.id !== 'about')
            .map((h) => (
              <li key={h.id}>
                <div>
                  <span className="rows__name">{h.label}</span>
                  <span className="rows__desc">{h.summary}</span>
                </div>
              </li>
            ))}
        </ul>
      </section>

      <section className="chapter chapter--flush">
        <h2>Skills</h2>
        <div className="columns">
          {expertise.map((e) => (
            <article key={e.title}>
              <h3>{e.title}</h3>
              <ul>
                {e.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <div className="page__cta">
        <Link className="btn" to="/work">
          See the work <span aria-hidden="true">→</span>
        </Link>
        <Link className="btn btn--gold" to="/contact">
          Contact <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
