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

**Add contact details** — fill `contactLinks` in `portfolio.ts` with verified links only, e.g.
`{ label: 'Email', value: 'name@example.com', href: 'mailto:name@example.com' }`. While it is
empty the contact page says details are not yet published. There is no contact form.

**Publish results** — add approved lines to a project's `results` array; they render in the case
study's Results section. The July 2026 combined-sales snapshot is kept in `draftProof`
(unpublished, not rendered, not shipped in the bundle). If it is ever shown it must carry its
caveat: combined brand sales, not paid-media-attributed revenue.

## Media still needed (placeholders are in place)

| Asset | Put it at | Then |
| --- | --- | --- |
| Real portrait | `public/media/mohamed-portrait.webp` | swap the placeholder in `components/portfolio/Portrait.tsx` for an `<img>` |
| Real handwritten signature | `public/media/mohamed-signature.svg` | swap the typographic stand-in in `components/portfolio/Signature.tsx` |
| Dahsha / ZezeWigs / Prestige visuals | `public/media/<slug>/` | replace `ProjectArt` in the case-study hero and gallery |
| Other approved client art, clips | `public/media/projects/<slug>/` | same |

The portrait, signature and all project art are clearly labelled placeholders — none is presented
as authentic. Review public-use permission for each client name before publishing.

## Network controls

Drag to pan · wheel or pinch to zoom at the pointer · click a node to inspect · `+` `−` `Reset`
buttons · `List` opens a keyboard- and touch-friendly index of every node · arrow keys pan,
`+`/`−` zoom, `0` resets, `Esc` clears the selection · double-click empty space to reset.
When fully zoomed out, scrolling down continues to the page. Idle motion is disabled under
`prefers-reduced-motion`, and rendering pauses when the tab is hidden or the network is off-screen.
