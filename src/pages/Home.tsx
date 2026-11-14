import { useCallback, useRef, useState } from 'react';
import { useJourney } from '../lib/useJourney';
import ScrollBand from '../components/portfolio/ScrollBand';
import Split from '../components/portfolio/Split';
import Rich, { plain } from '../components/portfolio/Rich';
import Reading from '../components/portfolio/Reading';
import IndustryExplorer from '../components/portfolio/IndustryExplorer';
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
import {
  brands,
  chapters,
  concepts,
  deliveredOutcomes,
  expertise,
  featuredStories,
  headlineProof,
  industries,
  journeyStops,
  profile,
  type HubId,
} from '../data/portfolio';
import ContactComposer from '../components/portfolio/ContactComposer';

function ChapterHead({ id, title }: { id: string; title: string }) {
  const c = chapters.find((ch) => ch.id === id)!;
  return (
    <header className="chapter__head">
      <p className="micro rv">
        <span className="gold">{c.n}</span> / {c.label}
      </p>
      <h2>
        <Split text={title} />
      </h2>
      <button type="button" className="micro chapter__back" onClick={() => window.scrollTo({ top: 0 })}>
        ↑ Network
      </button>
      <span className="chapter__ghost" aria-hidden="true">
        {c.n}
      </span>
    </header>
  );
}

export default function Home({ introDone }: { introDone: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const network = useRef<GrowthNetworkHandle>(null);

  const exhibit = useRef<HTMLDivElement>(null);
  const { stop, mode, goTo } = useJourney(exhibit);
  const activeHub = stop > 0 ? journeyStops[stop - 1].hub : null;


  const pick = useCallback(
    (hub: HubId) => {
      setSelectedId(null);
      goTo(journeyStops.findIndex((s) => s.hub === hub) + 1);
    },
    [goTo],
  );

  const markets = new Set(brands.map((b) => b.market)).size;

  return (
    <>
      <div className="exhibit" id="top" ref={exhibit}>
        <VerticalIdentity />
        <aside className="index-panel" aria-label="Portfolio index">
          <p className="micro index-panel__title">
            Portfolio <span aria-hidden="true">/</span> {profile.year}
          </p>
          <nav aria-label="Chapters">
            <ChapterIndex />
          </nav>
          <p className="micro index-panel__sub">Practice areas</p>
          <FeaturedMiniCards activeHub={activeHub} onPick={pick} />
          <p className="micro index-panel__foot">{profile.markets}</p>
        </aside>
        <GrowthNetwork
          ref={network}
          selectedId={selectedId}
          onSelect={setSelectedId}
          active={introDone}
          stop={stop}
          mode={mode}
          goTo={goTo}
        />
      </div>
      <ChapterRail />
      <div>

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
            <p className="lede">
              <Rich text={profile.intro} />
            </p>
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
          Most of the work is <mark className="hl">e-commerce</mark>: growing online stores on Salla, Zid and Shopify. The brands
          below are examples of that practice — <mark className="hl">the discipline is the point</mark>, not the logo.
        </p>
        <div className="rv">
          <WorkCarousel items={featuredStories} />
        </div>
        <Link className="btn rv" to="/work">
          Browse all work <span aria-hidden="true">→</span>
        </Link>
      </section>

      <ScrollBand rows={[['Stores', 'Media', 'Creative', 'Systems'], ['Salla', 'Zid', 'Shopify', 'WhatsApp']]} />

      <section className="chapter" id="impact">
        <ChapterHead id="impact" title="Impact, stated carefully." />
        <div className="proof">
          <p className="proof__figure">
            <CountUp value={headlineProof.value} prefix={headlineProof.prefix} suffix={headlineProof.suffix} />
          </p>
          <div className="proof__text">
            <p className="proof__label">{headlineProof.label}</p>
            <p className="proof__detail">
              <Rich text={headlineProof.detail} />
            </p>
            <Link className="btn btn--gold proof__cta" to="/work/three-brands-one-growth-discipline">
              See the store case study <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="facts">
          <div>
            <strong>{profile.experience}</strong>
            <span>in growth, media buying and marketing management</span>
          </div>
          <div>
            <strong>
              <CountUp value={brands.length} />
            </strong>
            <span>brands and practices worked with</span>
          </div>
          <div>
            <strong>
              <CountUp value={industries.length} />
            </strong>
            <span>industries — from premium beauty to healthcare and hospitality</span>
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
        <div className="outcomes">
          <p className="micro outcomes__label">
            <span className="gold">What the work delivered</span>
          </p>
          <ol className="principles">
            {deliveredOutcomes.map((o, i) => (
              <li key={o.title}>
                <span className="micro gold">{String(i + 1).padStart(2, '0')}</span>
                <h3>{o.title}</h3>
                <p>{o.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="chapter" id="expertise">
        <ChapterHead id="expertise" title="Industries first. Then the work." />
        <IndustryExplorer />
        <p className="micro capabilities__label">
          <span className="gold">Capabilities</span> — what runs across every industry
        </p>
        <div className="columns">
          {expertise.map((e) => (
            <article key={e.title}>
              <h3>{e.title}</h3>
              <p>
                <Rich text={e.body} />
              </p>
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
          on paper.
        </p>
        <ul className="rows">
          {concepts.map((c) => (
            <li key={c.slug}>
              <Link to={`/work/${c.slug}`}>
                <span className="rows__name">{c.name}</span>
                <span className="rows__desc">{plain(c.summary)}</span>
                <span className="status">{c.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="chapter" id="about">
        <ChapterHead id="about" title={profile.aboutAngle} />
        <Reading
          className="lede"
          text="Seven-plus years across Egypt, Saudi Arabia and the wider GCC — as strategist, marketing manager and media buyer. The campaigns matter; so does everything a customer meets before and after the click."
        />
        <Link className="btn" to="/about">
          Read the full story <span aria-hidden="true">→</span>
        </Link>
      </section>

      <ScrollBand rows={[['Say hello', 'Start here', 'One message']]} />

      <section className="chapter chapter--contact" id="contact">
        <ChapterHead id="contact" title={profile.contactLine} />
        <div className="rv">
          <ContactComposer compact />
        </div>
      </section>
      </div>
    </>
  );
}
