import { hubById, projectBySlug, skillById, type HubId } from '../../data/portfolio';
import type { Graph, NodeKind } from '../../lib/networkLayout';

export interface NodeDetail {
  id: string;
  kind: NodeKind;
  kindLabel: string;
  title: string;
  status?: string;
  meta: { label: string; value: string }[];
  summary: string;
  href?: string;
  hrefLabel?: string;
  connections: { id: string; label: string; kind: NodeKind }[];
}

const ORDER: NodeKind[] = ['hub', 'project', 'concept', 'story', 'skill', 'decor'];

/** Turns a graph node id into inspector content, straight from the portfolio data. */
export function describeNode(graph: Graph, id: string): NodeDetail | null {
  const i = graph.index.get(id);
  if (i === undefined) return null;
  const node = graph.nodes[i];
  const connections = graph.adj[i]
    .map((j) => graph.nodes[j])
    .filter((n) => !n.decorative)
    .sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind))
    .map((n) => ({ id: n.id, label: n.label, kind: n.kind }));
  const key = id.slice(id.indexOf(':') + 1);

  if (node.kind === 'hub') {
    const hub = hubById.get(key as HubId)!;
    return {
      id,
      kind: 'hub',
      kindLabel: 'Hub',
      title: hub.label,
      meta: [],
      summary: hub.summary,
      href: hub.id === 'about' ? '/about' : undefined,
      hrefLabel: 'Read the full story',
      connections,
    };
  }
  if (node.kind === 'skill') {
    const skill = skillById.get(key)!;
    return {
      id,
      kind: 'skill',
      kindLabel: 'Capability',
      title: skill.label,
      meta: [],
      summary: 'A capability applied across the connected work.',
      connections,
    };
  }
  const p = projectBySlug.get(key);
  if (!p) return null;
  return {
    id,
    kind: node.kind,
    kindLabel: p.kind === 'story' ? 'Case study' : p.kind === 'concept' ? 'Concept' : 'Project',
    title: p.alias ?? p.name,
    status: p.status,
    meta: [
      { label: 'Role', value: p.role },
      { label: 'Market', value: p.market },
      { label: 'Sector', value: p.sector },
    ],
    summary: p.summary,
    href: `/work/${p.slug}`,
    hrefLabel: 'View case study',
    connections,
  };
}
