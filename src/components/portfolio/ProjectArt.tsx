import { mulberry32 } from '../../lib/networkLayout';

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * Original placeholder art for a project: a small seeded constellation in the brand's own colour.
 * It stands in for real campaign media and is never presented as a real ad.
 */
type ArtSource = { slug: string; name: string; accent: string };

export default function ProjectArt({ project, label = false }: { project: ArtSource; label?: boolean }) {
  const rng = mulberry32(hash(project.slug));
  const cx = 110 + rng() * 180;
  const cy = 90 + rng() * 120;
  const rays = Array.from({ length: 16 }, () => {
    const a = rng() * Math.PI * 2;
    const r = 40 + rng() * 190;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, s: 1 + rng() * 2.2 };
  });
  const initials = project.name
    .replace(/[^A-Za-z ]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  const gid = `g-${project.slug}`;
  return (
    <svg className="art" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Placeholder artwork for ${project.name}`}>
      <defs>
        <radialGradient id={gid} cx={cx / 400} cy={cy / 300} r="0.75">
          <stop offset="0" stopColor={project.accent} stopOpacity="0.5" />
          <stop offset="1" stopColor={project.accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="#0a0a0a" />
      <rect width="400" height="300" fill={`url(#${gid})`} />
      <text x="388" y="286" textAnchor="end" className="art__initials" fill={project.accent} opacity="0.2">
        {initials}
      </text>
      <g stroke="#f4f1eb" strokeWidth="0.6" opacity="0.35">
        {rays.map((r, i) => (
          <line key={i} x1={cx} y1={cy} x2={r.x} y2={r.y} />
        ))}
      </g>
      <g fill="#f4f1eb">
        {rays.map((r, i) => (
          <circle key={i} cx={r.x} cy={r.y} r={r.s} opacity="0.8" />
        ))}
      </g>
      <circle cx={cx} cy={cy} r="17" fill="none" stroke={project.accent} strokeWidth="1" />
      <circle cx={cx} cy={cy} r="6" fill={project.accent} />
      {label && (
        <text x="14" y="24" className="art__label" fill="#a4a19c">
          PLACEHOLDER · MEDIA SLOT
        </text>
      )}
    </svg>
  );
}
