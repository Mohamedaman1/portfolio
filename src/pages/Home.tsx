import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import GrowthNetwork, { type GrowthNetworkHandle } from '../components/network/GrowthNetwork';
import ChapterIndex from '../components/portfolio/ChapterIndex';
import FeaturedMiniCards from '../components/portfolio/FeaturedMiniCards';
import Portrait from '../components/portfolio/Portrait';
import ChapterRail from '../components/portfolio/ChapterRail';
import CountUp from '../components/portfolio/CountUp';
import WorkCarousel from '../components/portfolio/WorkCarousel';
import Signature from '../components/portfolio/Signature';
import VerticalIdentity from '../components/portfolio/VerticalIdentity';
import { brands, chapters, concepts, contactLinks, expertise, featuredStories, headlineProof, profile } from '../data/portfolio';

function ChapterHead({ id, title }: { id: string; title: string }) {
  const c = chapters.find((ch) => ch.id === id)!;
  return (
    <header className="chapter__head">
      <p className="micro rv">
        <span className="gold">{c.n}</span> / {c.label}
      </p>
      <h2 className="rv rv--rise">{title}</h2>
      <a className="micro chapter__back" href="#top">
        ↑ Network
      </a>
      <span className="chapter__ghost" aria-hidden="true">
        {c.n}
      </span>
    </header>
  );
}

export default function Home({ introDone }: { introDone: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const network = useRef<GrowthNetworkHandle>(null);

  const pick = useCallback((id: string) => {
    setSelectedId(id);
    network.current?.focus(id);
  }, []);

  const markets = new Set(brands.map((b) => b.market)).size;

  return (
    <>
      <div className="exhibit" id="top">
        <VerticalIdentity />
        <aside className="index-panel" aria-label="Portfolio index">
          <p className="micro index-panel__title">
            Portfolio <span aria-hidden="true">/</span> {profile.year}
          </p>
          <nav aria-label="Chapters">
            <ChapterIndex />
          </nav>
          <p className="micro index-panel__sub">Practice areas</p>
          <FeaturedMiniCards selectedId={selectedId} onPick={pick} />
          <p className="micro index-panel__foot">{profile.markets}</p>
        </aside>
        <GrowthNetwork ref={network} selectedId={selectedId} onSelect={setSelectedId} active={introDone} />
      </div>
      <ChapterRail />

      <div className="marquee" aria-hidden="true">
        <div className="marquee__row">
          {[0, 1].map((k) => (
            <span key={k}>
              E-commerce &amp; Stores <i /> Performance Marketing <i /> Creative Direction <i /> Conversion Systems <i />{' '}
              {headlineProof.prefix}
              {headlineProof.value}
              {headlineProof.suffix} {headlineProof.label} <i /> Egypt / KSA / GCC <i />
            </span>
          ))}
        </div>
      </div>

      <section className="chapter chapter--intro" id="intro">
        <div className="intro">
          <div className="rv rv--scale">
            <Portrait />
          </div>
          <div className="intro__text rv">
            <p className="micro">
              <span className="gold">01</span> / Intro · Selected work / {profile.year}
            </p>
            <h1>{profile.tagline}</h1>
            <p className="lede">{profile.intro}</p>
            <ul className="tags">
              {profile.roles.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="micro">Growth × Creative × Performance · {profile.markets}</p>
            <Signature />
          </div>
        </div>
      </section>

      <section className="chapter" id="work">
        <ChapterHead id="work" title="Stores first. Six stories from the network." />
        <p className="lede lede--narrow rv">
          Most of the work is e-commerce: growing online stores on Salla, Zid and Shopify. The brands below are examples of
          that practice — the discipline is the point, not the logo.
        </p>
        <div className="rv">
          <WorkCarousel items={featuredStories} />
        </div>
        <Link className="btn rv" to="/work">
          Browse all work <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="chapter" id="impact">
        <ChapterHead id="impact" title="Impact, stated carefully." />
        <div className="proof rv rv--rise">
          <p className="proof__figure">
            <CountUp value={headlineProof.value} prefix={headlineProof.prefix} suffix={headlineProof.suffix} />
          </p>
          <div className="proof__text">
            <p className="proof__label">{headlineProof.label}</p>
            <p className="proof__detail">{headlineProof.detail}</p>
            <div className="proof__split" aria-hidden="true">
              <i style={{ flex: 5 }} />
              <i style={{ flex: 3 }} />
              <i style={{ flex: 2 }} />
              <i style={{ flex: 1.4 }} />
              <i style={{ flex: 1 }} />
            </div>
            <p className="micro">Spread across stores — shown as an illustration, not a per-brand breakdown</p>
          </div>
        </div>
        <div className="facts rv">
          <div>
            <strong>{profile.experience}</strong>
            <span>in growth, media buying and marketing management</span>
          </div>
          <div>
            <strong>
              <CountUp value={brands.length} />
            </strong>
            <span>brands and practices represented in this edition</span>
          </div>
          <div>
            <strong>
              <CountUp value={markets} />
            </strong>
            <span>markets — Egypt, Saudi Arabia and the UAE</span>
          </div>
          <div>
            <strong>
              <CountUp value={concepts.length} />
            </strong>
            <span>internal concepts and architectures in development</span>
          </div>
        </div>
        <div className="principles rv">
          <article>
            <h3>One system, not four departments</h3>
            <p>Acquisition, creative, storefront and follow-up are planned together, so each one makes the next easier.</p>
          </article>
          <article>
            <h3>Premium is a discipline</h3>
            <p>In premium categories the standard of the visual and the calm of the buying journey are part of the result.</p>
          </article>
          <article>
            <h3>Local means specific</h3>
            <p>For clinics and neighbourhood retail, the right area and plain language matter more than reach.</p>
          </article>
        </div>
        <p className="note rv">
          The sales figure is a combined total across stores and engagements. Per-brand figures, ROAS and ad-attributed revenue
          are not published in this edition.
        </p>
      </section>

      <section className="chapter" id="expertise">
        <ChapterHead id="expertise" title="What the work is made of." />
        <div className="columns rv">
          {expertise.map((e) => (
            <article key={e.title}>
              <h3>{e.title}</h3>
              <p>{e.body}</p>
              <ul>
                {e.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="chapter" id="systems">
        <ChapterHead id="systems" title="Systems & AI — ideas in progress." />
        <p className="lede lede--narrow">
          Internal concepts and workflow architecture. Each is labelled for what it is: a concept, a prototype or a design still
          on paper. None of them is connected to this site.
        </p>
        <ul className="rows rv">
          {concepts.map((c) => (
            <li key={c.slug}>
              <Link to={`/work/${c.slug}`}>
                <span className="rows__name">{c.name}</span>
                <span className="rows__desc">{c.summary}</span>
                <span className="status">{c.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="chapter" id="about">
        <ChapterHead id="about" title={profile.aboutAngle} />
        <p className="lede lede--narrow">
          Seven-plus years across Egypt, Saudi Arabia and the wider GCC — as strategist, marketing manager and media buyer. The
          campaigns matter; so does everything a customer meets before and after the click.
        </p>
        <Link className="btn" to="/about">
          Read the full story <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="chapter chapter--contact" id="contact">
        <ChapterHead id="contact" title={profile.contactLine} />
        <p className="arabic" lang="ar" dir="rtl">
          {profile.contactArabic}
        </p>
        <div className="page__cta rv">
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
    </>
  );
}
