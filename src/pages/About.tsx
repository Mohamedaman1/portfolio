import { Link } from 'react-router-dom';
import CountUp from '../components/portfolio/CountUp';
import Portrait from '../components/portfolio/Portrait';
import Rich from '../components/portfolio/Rich';
import Signature from '../components/portfolio/Signature';
import { brands, headlineProof, hubs, profile, skills } from '../data/portfolio';
import { candidUrl } from '../lib/portrait';

const story = [
  {
    title: 'It started with the ad.',
    body: `Mohamed Aman has spent **${profile.experience}** in growth and marketing — planning strategy, managing marketing, **buying media** and directing creative.`,
  },
  {
    title: 'Then the store behind it.',
    body: 'Most of that work is **e-commerce**: online stores in Saudi Arabia and the wider GCC, where the click is only the first step and **the storefront decides the rest**.',
  },
  {
    title: 'Then everything around it.',
    body: 'A campaign is only as good as **the page it lands on**, the conversation that follows and the operation that fulfils the order — so those are **part of the brief** too.',
  },
];

const process = [
  { title: 'Map', body: 'Trace what a customer meets, from first impression to delivery.' },
  { title: 'Fix', body: 'Repair the weakest step first — often the storefront, not the ad.' },
  { title: 'Launch', body: 'Creative and media built for the market they speak to.' },
  { title: 'Read', body: 'Report in a format someone can act on the same day.' },
  { title: 'Scale', body: 'Put budget behind what has already proved itself.' },
];

const pad = (n: number) => String(n).padStart(2, '0');

export default function About() {
  const markets = new Set(brands.map((b) => b.market)).size;
  const half = Math.ceil(skills.length / 2);
  const rows = [skills.slice(0, half), skills.slice(half)];

  return (
    <div className="page about">
      <header className="page__head about__head">
        <p className="micro">
          <span className="gold">About</span> / {profile.name}
        </p>
        <h1 className="about__title">
          <span>Not just ads.</span> <span className="gold">The system</span> <span>around them.</span>
        </h1>
      </header>

      <section className="about__split">
        <div className="about__portrait">
          <Portrait />
          <div className="about__sig">
            <Signature />
          </div>
          <p className="micro about__caption">
            {profile.name} · {profile.markets}
          </p>
        </div>
        <div className="about__story">
          <p className="lede rv">
            <Rich text={profile.intro} />
          </p>
          {story.map((s, i) => (
            <article className="about__beat rv" key={s.title}>
              <span className="about__beat-n" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <h2>{s.title}</h2>
              <p>
                <Rich text={s.body} />
              </p>
            </article>
          ))}
          <ul className="tags rv">
            {profile.roles.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about__stats rv" aria-label="In numbers">
        <div className="about__stat about__stat--lead">
          <strong>
            <CountUp value={headlineProof.value} prefix={headlineProof.prefix} suffix={headlineProof.suffix} />
          </strong>
          <span>{headlineProof.label}, combined across stores</span>
        </div>
        <div className="about__stat">
          <strong>
            <CountUp value={7} suffix="+" />
          </strong>
          <span>years in growth and marketing</span>
        </div>
        <div className="about__stat">
          <strong>
            <CountUp value={markets} />
          </strong>
          <span>markets — Egypt, Saudi Arabia, UAE</span>
        </div>
        <div className="about__stat">
          <strong>
            <CountUp value={brands.length} />
          </strong>
          <span>brands and practices in this edition</span>
        </div>
      </section>

      <section className="about__block">
        <h2 className="about__h rv">How the work runs</h2>
        <ol className="process rv">
          {process.map((p, i) => (
            <li key={p.title} style={{ ['--i' as string]: i }}>
              <span className="process__dot" aria-hidden="true" />
              <span className="micro gold">{pad(i + 1)}</span>
              <strong>{p.title}</strong>
              <span>{p.body}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="about__block">
        <h2 className="about__h rv">Where it has been applied</h2>
        <ul className="sectors">
          {hubs
            .filter((h) => h.id !== 'about')
            .map((h, i) => (
              <li className="rv" key={h.id}>
                <span className="micro gold">{pad(i + 1)}</span>
                <span className="sectors__name">{h.label}</span>
                <span className="sectors__desc">
                  <Rich text={h.summary} />
                </span>
              </li>
            ))}
        </ul>
      </section>

      <section className="about__skills" aria-label="Skills">
        {rows.map((row, r) => (
          <div className={`skills-row${r ? ' skills-row--reverse' : ''}`} key={r}>
            <div className="skills-row__track">
              {[0, 1].map((k) => (
                <span key={k} aria-hidden={k === 1}>
                  {row.map((s) => (
                    <em key={s.id}>{s.label}</em>
                  ))}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {candidUrl && (
        <section className="about__block">
          <h2 className="about__h rv">Off the record</h2>
          <div className="sides">
            {candidUrl && (
              <figure className="rv">
                <img src={candidUrl} alt="Mohamed Aman in sunglasses, smiling and giving a thumbs up" loading="lazy" width="1000" height="1333" />
                <figcaption className="micro">Between campaigns</figcaption>
              </figure>
            )}
            <p className="lede rv">
              Serious about the numbers, relaxed about everything else. Good marketing is made by people — it helps to be one.
            </p>
          </div>
        </section>
      )}

      <section className="about__cta rv">
        <h2>Have a store that should be selling more?</h2>
        <div className="page__cta">
          <Link className="btn btn--gold" to="/contact">
            Start the conversation <span aria-hidden="true">→</span>
          </Link>
          <Link className="btn" to="/work">
            See the work <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
