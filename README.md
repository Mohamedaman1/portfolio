# Mohamed Aman — The Growth Edition

A standalone personal portfolio. The first screen is an interactive, Obsidian-style network of
Mohamed's work (hubs, projects, capabilities, case studies) with a visible left index and
editorial mini cards; below it sit the editorial chapters and case-study pages.

**Standalone by design:** no backend, no APIs, no analytics, no tracking, no external requests.
All content is local and static. Fonts are bundled from npm (`@fontsource`), not loaded from a CDN.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
npm run typecheck
npm run lint
npm test           # unit tests: graph integrity, camera math, hit testing
```

The site uses client-side routes (`/work`, `/work/:slug`, `/about`, `/contact`). When hosting the
static `dist/` folder, configure the host to serve `index.html` for unknown paths.

## Where things live

| What | File |
| --- | --- |
| All content: hubs, projects, skills, chapters, copy, contact links | `src/data/portfolio.ts` |
| Hub positions, hub-to-hub links, layout seed | `src/data/graph.ts` |
| Graph construction (seeded layout, decorative satellites) | `src/lib/networkLayout.ts` |
| Camera math (fit, pan clamp, zoom at pointer) | `src/lib/networkCamera.ts` |
| Hit testing | `src/lib/networkHitTest.ts` |
| Canvas renderer and interaction | `src/components/network/NetworkCanvas.tsx` |
| Inspector, controls, list view | `src/components/network/` |
| Header, index panel, mini cards, placeholders | `src/components/portfolio/` |
| Design tokens (Vanta black, pearl, champagne gold) | `src/styles/tokens.css` |

The network is generated from `portfolio.ts`: add a project there and it appears in the graph,
the list view, `/work` and gets its own `/work/<slug>` page. Nothing is duplicated.

## Editing content

**Add a client or project** — append an entry to `projects` in `src/data/portfolio.ts`.
`hubs[0]` is the cluster it sits in; further hubs draw cross-links. `skills` must be ids from the
`skills` list. Use an accurate `status` (`Live professional engagement`, `Case study`, `Concept`,
`Prototype`, `Architecture in development`).

**Add a featured case study** — add a project with `kind: 'story'`, a `featured` order and
`related` slugs. It appears as a small card node between the work it describes.

**Contact details** — `contactLinks` in `portfolio.ts` holds the WhatsApp and LinkedIn links.
They are plain outbound links; there is no contact form and nothing is sent anywhere.

**Headline figure** — `headlineProof` in `portfolio.ts` drives the `$2M+` shown in the Impact
chapter, the lead practice-area card and the marquee. It is a combined total across stores.

**Practice-area cards** — `featuredAreas` in `portfolio.ts`. E-commerce & Stores leads; brands
appear as examples inside the network and case studies, not as headline cards.

**Publish per-project results** — add approved lines to a project's `results` array; they render in
the case study's Results section. The July 2026 per-brand snapshot is kept in `draftProof`
(unpublished, not rendered, not shipped in the bundle). If it is ever shown it must carry its
caveat: combined brand sales, not paid-media-attributed revenue.

## Opening intro and the portrait

On the first visit of a browser session the home page opens with a dot sequence: scattered network
dots gather into a figure, hold, then burst outward as the site opens. Any click or key skips it,
and it is disabled under `prefers-reduced-motion`.

**Mohamed's media lives in `src/assets/`** and is picked up by filename (see `src/lib/portrait.ts`):

| File | Used for |
| --- | --- |
| `portrait.webp` | Intro and About portrait (4:5 crop of the studio photo) |
| `portrait-intro.webp` | Tighter head-and-shoulders crop, shadows lifted, that the intro builds out of dots |
| `signature.webp` | Handwritten signature, white ink on transparent (intro, Intro, About, footer) |
| `illustration.webp`, `candid.webp` | "Off the record" strip on the About page |

Replace a file with the same name to swap it. If a file is removed, the site falls back to a
labelled placeholder (portrait, signature) or leaves the block out.

## Motion and navigation

- Hub stepper (`← 01 / 07 →`) in the network turns the camera from hub to hub.
- Featured case studies are a snap carousel with arrow buttons, arrow keys and a counter.
- A floating chapter rail shows `03 / 07` with `↑ ↓` arrows to turn chapters, plus a scroll-progress line.
- Sections reveal on scroll, numbers count up, chapter numerals drift (CSS scroll timelines where supported).

## Media still needed

| Asset | Put it at | Then |
| --- | --- | --- |
| Dahsha / ZezeWigs / Prestige visuals | `public/media/<slug>/` | replace `ProjectArt` in the case-study hero and gallery |
| Other approved client art, clips | `public/media/projects/<slug>/` | same |

Project art is clearly labelled placeholder artwork — none of it is presented as a real ad. Review public-use permission for each client name before publishing.

## Network controls

Drag to pan · wheel or pinch to zoom at the pointer · click a node to inspect · `+` `−` `Reset`
buttons · `List` opens a keyboard- and touch-friendly index of every node · arrow keys pan,
`+`/`−` zoom, `0` resets, `Esc` clears the selection · double-click empty space to reset.
When fully zoomed out, scrolling down continues to the page. Idle motion is disabled under
`prefers-reduced-motion`, and rendering pauses when the tab is hidden or the network is off-screen.
