import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import GrowthNetwork, { type GrowthNetworkHandle } from '../components/network/GrowthNetwork';
import ChapterIndex from '../components/portfolio/ChapterIndex';
import FeaturedMiniCards from '../components/portfolio/FeaturedMiniCards';
import Portrait from '../components/portfolio/Portrait';
import ProjectCard from '../components/portfolio/ProjectCard';
import Signature from '../components/portfolio/Signature';
import VerticalIdentity from '../components/portfolio/VerticalIdentity';
import { brands, chapters, concepts, expertise, featuredStories, profile } from '../data/portfolio';

function ChapterHead({ id, title }: { id: string; title: string }) {
  const c = chapters.find((ch) => ch.id === id)!;
  return (
    <header className="chapter__head">
      <p className="micro">
        <span className="gold">{c.n}</span> / {c.label}
      </p>
      <h2>{title}</h2>
      <a className="micro chapter__back" href="#top">
        ↑ Network
      </a>
    </header>
  );
}

export default function Home() {
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
          <p className="micro index-panel__sub">Featured in the network</p>
          <FeaturedMiniCards selectedId={selectedId} onPick={pick} />
          <p className="micro index-panel__foot">{profile.markets}</p>
        </aside>
        <GrowthNetwork ref={network} selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      <section className="chapter chapter--intro" id="intro">
        <div className="intro">
          <Portrait />
          <div className="intro__text">
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
        <ChapterHead id="work" title="Six stories from the network." />
        <div className="cards">
          {featuredStories.map((p, i) => (
            <ProjectCard key={p.slug} project={p} n={String(i + 1).padStart(2, '0')} />
          ))}
        </div>
        <Link className="btn" to="/work">
          Browse all work <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="chapter" id="impact">
        <ChapterHead id="impact" title="Impact, stated carefully." />
        <div className="facts">
          <div>
            <strong>{profile.experience}</strong>
            <span>in growth, media buying and marketing management</span>
          </div>
          <div>
            <strong>{brands.length}</strong>
            <span>brands and practices represented in this edition</span>
          </div>
          <div>
            <strong>{markets}</strong>
            <span>markets — Egypt, Saudi Arabia and the UAE</span>
          </div>
          <div>
            <strong>{concepts.length}</strong>
            <span>internal concepts and architectures in development</span>
          </div>
        </div>
        <div className="principles">
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
        <p className="note">
          Commercial figures are withheld from this public edition. Nothing here claims revenue, ROAS or results that have not
          been approved for publication.
        </p>
      </section>

      <section className="chapter" id="expertise">
        <ChapterHead id="expertise" title="What the work is made of." />
        <div className="columns">
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
        <ul className="rows">
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
        <Link className="btn btn--gold" to="/contact">
          Contact <span aria-hidden="true">→</span>
        </Link>
      </section>
    </>
  );
}
