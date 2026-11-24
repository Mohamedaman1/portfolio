/**
 * Runs after `vite build`. GitHub Pages answers unknown paths with HTTP 404 (even with a 404.html fallback),
 * and crawlers such as Meta's validator do not run JavaScript. So every route gets a real file that returns
 * 200, and the privacy policy also carries its full text in the HTML.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { contactLinks, projects } from '../src/data/portfolio';
import { PRIVACY_UPDATED, privacySections } from '../src/data/privacy';

const dist = new URL('../dist/', import.meta.url).pathname;
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const SITE = 'https://mohamedaman.pro';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function page(route: string, title: string, bodyHtml?: string) {
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE}/${route}/" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${SITE}/${route}/" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`);
  if (bodyHtml) html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  const dir = join(dist, route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

const privacyHtml = `<main style="max-width:720px;margin:0 auto;padding:48px 20px;font:16px/1.65 system-ui,sans-serif;color:#f4f1eb;background:#020202;min-height:100vh">
<h1 style="font-size:40px;line-height:1.1">Privacy policy</h1>
<p>Mohamed Aman — last updated ${esc(PRIVACY_UPDATED)}</p>
${privacySections
  .map(
    (s) =>
      `<section id="${s.id}"><h2>${esc(s.title)}</h2>${s.blocks
        .map((b) => ('p' in b ? `<p>${esc(b.p)}</p>` : `<ul>${b.ul.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>`))
        .join('')}</section>`,
  )
  .join('\n')}
<section id="contact"><h2>Contact</h2><p>${contactLinks.map((l) => `<a style="color:#b8a17a" href="${esc(l.href)}">${esc(l.label)}</a>`).join(' · ')}</p></section>
<p><a style="color:#b8a17a" href="/">Back to the portfolio</a></p>
</main>`;

page('privacy', 'Privacy policy — Mohamed Aman', privacyHtml);
page('work', 'Work — Mohamed Aman');
page('about', 'About — Mohamed Aman');
page('contact', 'Contact — Mohamed Aman');
for (const p of projects) page(`work/${p.slug}`, `${p.name} — Mohamed Aman`);
console.log(`prerendered ${5 + projects.length} routes`);
