/**
 * Single source of truth for all portfolio content.
 * Everything here is local, static text — nothing is fetched, synced or connected.
 * Edit this file to add clients, copy, links and (once approved) metrics.
 */

export type HubId =
  | 'ecommerce'
  | 'performance'
  | 'creative'
  | 'healthcare'
  | 'retail'
  | 'systems'
  | 'about';

export interface Hub {
  id: HubId;
  label: string;
  summary: string;
}

export const hubs: Hub[] = [
  {
    id: 'ecommerce',
    label: 'Premium E-commerce',
    summary:
      'Premium Saudi and GCC storefronts where acquisition, creative and the path to purchase are treated as one system.',
  },
  {
    id: 'performance',
    label: 'Performance Marketing',
    summary:
      'Paid social planning, media buying and reporting across Meta, TikTok and Snapchat for e-commerce and local services.',
  },
  {
    id: 'creative',
    label: 'Creative Direction',
    summary:
      'Campaign concepts, visual direction and localized content that give paid media something worth scaling.',
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    summary:
      'Area-targeted advertising and video campaign direction for Egyptian clinics and practitioners, without patient claims.',
  },
  {
    id: 'retail',
    label: 'Retail & Services',
    summary:
      'Local Egyptian retail, launch communication and service businesses — acquisition grounded in neighbourhood context.',
  },
  {
    id: 'systems',
    label: 'Systems & AI',
    summary:
      'Internal product concepts and workflow architecture for sales, planning and operations. Concepts and prototypes, labelled as such.',
  },
  {
    id: 'about',
    label: 'Mohamed / About',
    summary:
      'Growth strategist and marketing manager with 7+ years across Egypt, Saudi Arabia and the wider GCC.',
  },
];

export interface Skill {
  id: string;
  label: string;
  hubs: HubId[];
}

export const skills: Skill[] = [
  { id: 'meta-ads', label: 'Meta Ads', hubs: ['performance'] },
  { id: 'tiktok-ads', label: 'TikTok Ads', hubs: ['performance'] },
  { id: 'snapchat-ads', label: 'Snapchat Ads', hubs: ['performance'] },
  { id: 'storefront-ux', label: 'Salla / Zid / Shopify UX', hubs: ['ecommerce'] },
  { id: 'seo-structure', label: 'SEO URL Structure', hubs: ['ecommerce'] },
  { id: 'whatsapp-journey', label: 'WhatsApp Journey', hubs: ['ecommerce', 'systems'] },
  { id: 'creative-strategy', label: 'Creative Strategy', hubs: ['creative', 'performance'] },
  { id: 'brand-identity', label: 'Brand Identity', hubs: ['creative'] },
  { id: 'video-direction', label: 'Video Campaign Direction', hubs: ['creative', 'healthcare'] },
  { id: 'content-strategy', label: 'Content Strategy', hubs: ['creative', 'retail'] },
  { id: 'visual-merchandising', label: 'Visual Merchandising', hubs: ['retail'] },
  { id: 'local-targeting', label: 'Local Area Targeting', hubs: ['performance', 'healthcare'] },
  { id: 'reporting', label: 'Reporting', hubs: ['performance', 'systems'] },
  { id: 'ai-workflow', label: 'AI Workflow Design', hubs: ['systems'] },
];

export type Category = 'E-commerce' | 'Healthcare' | 'Retail & Services' | 'Systems & AI';
export const categories: Category[] = ['E-commerce', 'Healthcare', 'Retail & Services', 'Systems & AI'];

export type Status =
  | 'Live professional engagement'
  | 'Case study'
  | 'Concept'
  | 'Prototype'
  | 'Architecture in development'
  | 'Professional identity';

export type ProjectKind = 'brand' | 'concept' | 'story';

export interface Project {
  slug: string;
  name: string;
  /** brand = client/business, concept = internal product or architecture, story = featured case study */
  kind: ProjectKind;
  category: Category;
  /** First hub is the primary cluster in the network. */
  hubs: HubId[];
  market: string;
  sector: string;
  role: string;
  status: Status;
  summary: string;
  challenge: string;
  approach: string[];
  deliverables: string[];
  skills: string[];
  /** Brand colour — used ONLY inside this project's own art. */
  accent: string;
  /** Slugs of related projects (for stories: the brands/concepts they cover). */
  related?: string[];
  /** Order in the featured case-study list (stories only). */
  featured?: number;
  /** Pin a small thumbnail card to this node in the network. */
  thumbnail?: boolean;
  /** Approved, publishable results. Leave empty until Mohamed signs off. */
  results?: string[];
}

const NEUTRAL = '#8E8A82';

export const projects: Project[] = [
  /* ───────────── Premium e-commerce ───────────── */
  {
    slug: 'dahsha',
    name: 'Dahsha',
    kind: 'brand',
    category: 'E-commerce',
    hubs: ['ecommerce', 'performance', 'creative'],
    market: 'Saudi Arabia',
    sector: 'Premium human-hair wigs',
    role: 'Performance marketing, creative direction, storefront UX',
    status: 'Live professional engagement',
    summary:
      'Performance marketing and luxury creative direction for a premium Saudi wig brand, including the 11/11 art campaign and a Zid storefront shaped around a mobile hero and a WhatsApp conversion path.',
    challenge:
      'A premium product needs paid media, visuals and the storefront to tell the same story — on a phone, in seconds, with a clear next step.',
    approach: [
      'Plan and manage paid social around the brand’s premium positioning.',
      'Direct luxury campaign creative, including the 11/11 art campaign.',
      'Shape the Zid storefront: mobile hero, product journey and WhatsApp conversion UX.',
    ],
    deliverables: [
      'Paid social campaign management',
      '11/11 art campaign direction',
      'Zid storefront and mobile hero direction',
      'WhatsApp conversion journey',
    ],
    skills: ['creative-strategy', 'storefront-ux', 'whatsapp-journey'],
    accent: '#3F74C4',
    thumbnail: true,
  },
  {
    slug: 'zezewigs',
    name: 'ZezeWigs',
    kind: 'brand',
    category: 'E-commerce',
    hubs: ['ecommerce', 'performance', 'creative'],
    market: 'Saudi Arabia',
    sector: 'Premium human-hair wigs',
    role: 'Paid social, creative, theme direction, UX and SEO',
    status: 'Live professional engagement',
    summary:
      'Paid social and creative for a premium Saudi wig brand, alongside Salla / Shopify theme direction, UX refinements and SEO-friendly URL improvements.',
    challenge:
      'Keep acquisition and the storefront moving together: creative that earns the click, and a store structure that is easy to browse and easy to find.',
    approach: [
      'Run paid social with creative built for the brand’s audience.',
      'Direct storefront theme and UX decisions across Salla and Shopify.',
      'Improve URL structure with search visibility in mind.',
    ],
    deliverables: [
      'Paid social campaign management',
      'Campaign creative direction',
      'Theme and UX direction',
      'SEO URL improvements',
    ],
    skills: ['creative-strategy', 'storefront-ux', 'seo-structure'],
    accent: '#E08DB0',
    thumbnail: true,
  },
  {
    slug: 'prestige-wigs',
    name: 'Prestige Wigs',
    kind: 'brand',
    category: 'E-commerce',
    hubs: ['ecommerce', 'performance'],
    market: 'Saudi Arabia',
    sector: 'Premium human-hair wigs',
    role: 'Performance marketing, premium visuals, store UX, reporting',
    status: 'Live professional engagement',
    summary:
      'Performance marketing and premium visuals for a Saudi wig brand, with Salla store, cart and product-page UX work and structured reporting.',
    challenge:
      'Give a premium catalogue a calm, credible buying experience and a reporting rhythm the team can act on.',
    approach: [
      'Manage paid media with premium visual standards.',
      'Refine the Salla store, cart and product-page experience.',
      'Report on performance in a consistent, decision-ready format.',
    ],
    deliverables: [
      'Paid media management',
      'Premium visual direction',
      'Salla store, cart and product UX',
      'Performance reporting',
    ],
    skills: ['storefront-ux', 'reporting', 'creative-strategy'],
    accent: '#CDB592',
    thumbnail: true,
  },
  {
    slug: 'rayah',
    name: 'Rayah',
    kind: 'brand',
    category: 'E-commerce',
    hubs: ['ecommerce', 'performance'],
    market: 'United Arab Emirates',
    sector: 'E-commerce',
    role: 'Social acquisition campaigns, marketing direction',
    status: 'Live professional engagement',
    summary: 'Social acquisition campaigns and marketing direction for a UAE e-commerce brand.',
    challenge: 'Carry a disciplined acquisition approach into a different GCC market and audience.',
    approach: [
      'Plan social acquisition campaigns for the UAE market.',
      'Provide marketing direction around the campaign calendar.',
    ],
    deliverables: ['Social acquisition campaigns', 'Marketing direction'],
    skills: ['creative-strategy'],
    accent: NEUTRAL,
  },

  /* ───────────── Healthcare ───────────── */
  {
    slug: 'dr-hossam-hassan',
    name: 'Dr Hossam Hassan',
    kind: 'brand',
    category: 'Healthcare',
    hubs: ['healthcare', 'performance', 'creative'],
    market: 'Egypt',
    sector: 'Physiotherapy',
    role: 'Localized advertising, medical video campaign direction',
    status: 'Live professional engagement',
    summary: 'Localized advertising and medical video campaign direction for a physiotherapy practice in Egypt.',
    challenge: 'Reach the right nearby audience with clear, responsible communication — no health promises.',
    approach: [
      'Build localized ad campaigns around the practice’s catchment area.',
      'Direct educational video content for campaign use.',
    ],
    deliverables: ['Localized ad campaigns', 'Medical video campaign direction'],
    skills: ['local-targeting', 'video-direction'],
    accent: NEUTRAL,
  },
  {
    slug: 'dr-mohamed-sadaka',
    name: 'Dr Mohamed Sadaka',
    kind: 'brand',
    category: 'Healthcare',
    hubs: ['healthcare', 'performance'],
    market: 'Egypt',
    sector: 'Physiotherapy',
    role: 'Area-targeted ads, video campaigns',
    status: 'Live professional engagement',
    summary: 'Area-targeted physiotherapy advertising and shoulder-related video campaigns in Egypt.',
    challenge: 'Make a specialist service visible to people close enough to book, with content that explains rather than promises.',
    approach: [
      'Target campaigns by area around the clinic.',
      'Plan and direct shoulder-related video campaigns.',
    ],
    deliverables: ['Area-targeted ad campaigns', 'Shoulder-related video campaigns'],
    skills: ['local-targeting', 'video-direction'],
    accent: NEUTRAL,
  },
  {
    slug: 'dr-amr-azzam',
    name: 'Dr Amr Azzam',
    kind: 'brand',
    category: 'Healthcare',
    hubs: ['healthcare', 'performance'],
    market: 'Egypt',
    sector: 'Healthcare',
    role: 'Performance marketing',
    status: 'Live professional engagement',
    summary: 'Performance marketing for a healthcare practice in Egypt.',
    challenge: 'Run paid acquisition for a healthcare practice with appropriate restraint.',
    approach: ['Plan and manage performance marketing campaigns.'],
    deliverables: ['Performance marketing campaigns'],
    skills: ['local-targeting'],
    accent: NEUTRAL,
  },

  /* ───────────── Retail & services ───────────── */
  {
    slug: 'el-gannayni-sportswear',
    name: 'El-Gannayni Sportswear',
    kind: 'brand',
    category: 'Retail & Services',
    hubs: ['retail', 'performance', 'creative'],
    market: 'Egypt',
    sector: 'Sportswear retail',
    role: 'Ads, sportswear creative and content, visual merchandising',
    status: 'Live professional engagement',
    summary: 'Advertising, sportswear creative and content, and visual merchandising for an Egyptian sportswear retailer.',
    challenge: 'Connect what shoppers see in ads with what they find on the shelf.',
    approach: [
      'Manage advertising for the retail offer.',
      'Produce sportswear creative and content.',
      'Advise on visual merchandising.',
    ],
    deliverables: ['Ad campaigns', 'Sportswear creative and content', 'Visual merchandising direction'],
    skills: ['content-strategy', 'visual-merchandising'],
    accent: NEUTRAL,
  },
  {
    slug: 'kareem-pharmacies',
    name: 'Kareem Pharmacies',
    kind: 'brand',
    category: 'Retail & Services',
    hubs: ['retail', 'creative'],
    market: 'Egypt',
    sector: 'Pharmacy retail',
    role: 'Soft-opening visual direction, brand communication',
    status: 'Live professional engagement',
    summary: 'Soft-opening visual direction, brand communication, launch creative and content templates for a pharmacy retailer in Egypt.',
    challenge: 'Give a soft opening a consistent visual voice the team can keep using after launch.',
    approach: [
      'Set the visual direction for the soft opening.',
      'Shape brand communication and launch creative.',
      'Build reusable content templates.',
    ],
    deliverables: ['Soft-opening visual direction', 'Launch creative', 'Content templates'],
    skills: ['brand-identity', 'content-strategy'],
    accent: NEUTRAL,
  },
  {
    slug: 'seville',
    name: 'Seville',
    kind: 'brand',
    category: 'Retail & Services',
    hubs: ['retail', 'creative'],
    market: 'Egypt',
    sector: 'Social / business launch',
    role: 'Marketing and content strategy, social video concepts',
    status: 'Live professional engagement',
    summary: 'Marketing and content strategy with social video concept planning for a business launch in Egypt.',
    challenge: 'Enter social with a plan — what to say, in which format, in what order.',
    approach: ['Define marketing and content strategy.', 'Plan social video concepts.'],
    deliverables: ['Marketing and content strategy', 'Social video concept plan'],
    skills: ['content-strategy', 'video-direction'],
    accent: NEUTRAL,
  },
  {
    slug: 'elin-swimming-academy',
    name: 'Elin Swimming Academy',
    kind: 'brand',
    category: 'Retail & Services',
    hubs: ['retail', 'performance'],
    market: 'Egypt',
    sector: 'Family services',
    role: 'Local acquisition, content strategy',
    status: 'Live professional engagement',
    summary: 'Local acquisition and content strategy for private swimming lessons in Egypt.',
    challenge: 'Reach nearby families and make a private-lesson offer easy to understand.',
    approach: ['Plan local acquisition campaigns.', 'Set content strategy for the academy.'],
    deliverables: ['Local acquisition campaigns', 'Content strategy'],
    skills: ['local-targeting', 'content-strategy'],
    accent: NEUTRAL,
  },
  {
    slug: 'viral-social-media-services',
    name: 'Viral Social Media Services',
    kind: 'brand',
    category: 'Retail & Services',
    hubs: ['about', 'performance'],
    market: 'Egypt',
    sector: 'Marketing services',
    role: 'Business identity and service leadership',
    status: 'Professional identity',
    summary: 'Mohamed’s professional and business identity for marketing services — the practice behind much of the client work shown here.',
    challenge: 'Offer strategy, media and creative as one accountable service.',
    approach: ['Lead service delivery across strategy, paid media and creative.'],
    deliverables: ['Marketing service leadership'],
    skills: ['creative-strategy', 'reporting'],
    accent: NEUTRAL,
  },

  /* ───────────── Systems & AI (concepts — not released products) ───────────── */
  {
    slug: 'sales-compass',
    name: 'Sales Compass',
    kind: 'concept',
    category: 'Systems & AI',
    hubs: ['systems'],
    market: 'Internal',
    sector: 'Sales enablement',
    role: 'Product concept and workflow design',
    status: 'Prototype',
    summary: 'An internal product concept for sales assessments, enablement and admin workflows. Prototype in ongoing development.',
    challenge: 'Give sales teams a clear read on where they stand and what to practise next.',
    approach: ['Define assessment and enablement flows.', 'Design admin workflows around them.'],
    deliverables: ['Product concept', 'Workflow design', 'Prototype (ongoing)'],
    skills: ['ai-workflow'],
    accent: NEUTRAL,
  },
  {
    slug: 'content-planner-pro',
    name: 'Content Planner Pro',
    kind: 'concept',
    category: 'Systems & AI',
    hubs: ['systems', 'creative'],
    market: 'Internal',
    sector: 'Marketing operations',
    role: 'Product concept and workflow design',
    status: 'Prototype',
    summary: 'An internal concept for marketing planning and creative / operations tooling. Prototype in ongoing development.',
    challenge: 'Keep planning, creative and operations in one view instead of scattered threads.',
    approach: ['Map the planning workflow.', 'Design tooling for creative and operations hand-offs.'],
    deliverables: ['Product concept', 'Workflow design', 'Prototype (ongoing)'],
    skills: ['ai-workflow', 'content-strategy'],
    accent: NEUTRAL,
  },
  {
    slug: 'viral-wig-studio',
    name: 'Viral Wig Studio',
    kind: 'concept',
    category: 'Systems & AI',
    hubs: ['systems', 'ecommerce'],
    market: 'Internal',
    sector: 'Product visualization',
    role: 'Product concept',
    status: 'Concept',
    summary: 'A concept for 3D hair and wig visualization and a product try-on idea. Concept / prototype stage — not a released app.',
    challenge: 'Help a shopper picture a wig before they buy it.',
    approach: ['Explore 3D visualization and try-on as a product idea.'],
    deliverables: ['Product concept'],
    skills: ['ai-workflow'],
    accent: NEUTRAL,
  },
  {
    slug: 'unified-ads-manager',
    name: 'Unified Ads Manager',
    kind: 'concept',
    category: 'Systems & AI',
    hubs: ['systems', 'performance'],
    market: 'Internal',
    sector: 'Marketing performance',
    role: 'Product concept',
    status: 'Concept',
    summary: 'A concept for unified marketing performance management. In progress as an idea — it is not connected to this site or to any ad account.',
    challenge: 'See performance across channels in one consistent frame.',
    approach: ['Define what a unified performance view should answer.'],
    deliverables: ['Product concept (in progress)'],
    skills: ['reporting', 'ai-workflow'],
    accent: NEUTRAL,
  },
  {
    slug: 'whatsapp-order-automation',
    name: 'WhatsApp-first Order Automation',
    kind: 'concept',
    category: 'Systems & AI',
    hubs: ['systems', 'ecommerce'],
    market: 'Internal',
    sector: 'Sales operations',
    role: 'Workflow architecture and planning',
    status: 'Architecture in development',
    summary: 'Architecture work for a proposed seller workflow: Respond.io → n8n → Daftra → courier (SMSA / Fastlo), with reporting. A planned design — not a deployed integration.',
    challenge: 'Carry an order from a WhatsApp conversation to the courier without manual re-entry.',
    approach: [
      'Map the seller workflow from conversation to fulfilment.',
      'Propose how messaging, automation, invoicing and courier steps hand off.',
      'Define the reporting the workflow should produce.',
    ],
    deliverables: ['Workflow architecture', 'Hand-off and reporting plan'],
    skills: ['whatsapp-journey', 'ai-workflow', 'reporting'],
    accent: NEUTRAL,
  },

  /* ───────────── Featured case studies ───────────── */
  {
    slug: 'three-brands-one-growth-discipline',
    name: 'Three Brands. One Growth Discipline.',
    kind: 'story',
    category: 'E-commerce',
    hubs: ['ecommerce'],
    market: 'Saudi Arabia',
    sector: 'Premium human-hair wigs',
    role: 'Growth and media lead across three brands',
    status: 'Case study',
    summary: 'Dahsha, ZezeWigs and Prestige Wigs: one operating approach to premium Saudi multibrand growth and media.',
    challenge: 'Three premium brands in the same category need distinct voices and one consistent way of working.',
    approach: [
      'Keep each brand’s identity separate in creative and storefront.',
      'Share one discipline for planning, media and reporting.',
    ],
    deliverables: ['Multibrand media operating approach', 'Per-brand creative direction', 'Shared reporting rhythm'],
    skills: ['creative-strategy', 'reporting'],
    accent: '#B8A17A',
    related: ['dahsha', 'zezewigs', 'prestige-wigs'],
    featured: 1,
  },
  {
    slug: 'from-storefront-to-conversion',
    name: 'From Storefront to Conversion',
    kind: 'story',
    category: 'E-commerce',
    hubs: ['ecommerce'],
    market: 'Saudi Arabia',
    sector: 'Commerce UX',
    role: 'Storefront and conversion UX direction',
    status: 'Case study',
    summary: 'Dahsha’s mobile experience on Zid: site, video and the WhatsApp journey designed as one path.',
    challenge: 'Most visitors arrive on a phone. The first screen has to carry the brand and point to the next step.',
    approach: [
      'Lead with a mobile hero that carries the brand.',
      'Use video where it helps the product speak.',
      'Make WhatsApp a deliberate conversion step.',
    ],
    deliverables: ['Mobile hero direction', 'Site and video journey', 'WhatsApp conversion path'],
    skills: ['storefront-ux', 'whatsapp-journey'],
    accent: '#3F74C4',
    related: ['dahsha'],
    featured: 2,
  },
  {
    slug: 'culture-meets-conversion',
    name: 'Culture Meets Conversion',
    kind: 'story',
    category: 'E-commerce',
    hubs: ['creative'],
    market: 'Saudi Arabia',
    sector: 'Creative direction',
    role: 'Creative direction and localization',
    status: 'Case study',
    summary: 'Saudi premium-wig content, visuals and localized creative — made for the audience it speaks to.',
    challenge: 'Premium creative has to feel local before it can sell.',
    approach: ['Localize concepts, language and visual cues.', 'Hold a premium visual standard across formats.'],
    deliverables: ['Localized campaign creative', 'Premium visual direction'],
    skills: ['creative-strategy', 'brand-identity'],
    accent: '#E08DB0',
    related: ['dahsha', 'zezewigs', 'prestige-wigs'],
    featured: 3,
  },
  {
    slug: 'a-smarter-sales-operation',
    name: 'A Smarter Sales Operation',
    kind: 'story',
    category: 'Systems & AI',
    hubs: ['systems'],
    market: 'Internal',
    sector: 'Sales operations',
    role: 'Workflow architecture',
    status: 'Architecture in development',
    summary: 'WhatsApp, CRM and fulfilment automation — an architecture in development, not a deployed integration.',
    challenge: 'Orders that start in chat tend to be re-typed by hand at every step.',
    approach: ['Design the hand-offs on paper first.', 'Decide what should be automated and what should stay human.'],
    deliverables: ['Workflow architecture', 'Reporting plan'],
    skills: ['whatsapp-journey', 'ai-workflow'],
    accent: '#8E8A82',
    related: ['whatsapp-order-automation'],
    featured: 4,
  },
  {
    slug: 'better-workflows-stronger-teams',
    name: 'Better Workflows, Stronger Teams',
    kind: 'story',
    category: 'Systems & AI',
    hubs: ['systems'],
    market: 'Internal',
    sector: 'Internal tooling',
    role: 'Product concepts and workflow design',
    status: 'Concept',
    summary: 'Sales Compass, Content Planner Pro and Viral Wig Studio — internal concepts for how teams sell, plan and present.',
    challenge: 'Good marketing stalls when the work around it is improvised.',
    approach: ['Turn recurring team problems into product concepts.', 'Prototype where it clarifies the idea.'],
    deliverables: ['Three internal product concepts', 'Prototypes in ongoing development'],
    skills: ['ai-workflow'],
    accent: '#8E8A82',
    related: ['sales-compass', 'content-planner-pro', 'viral-wig-studio'],
    featured: 5,
  },
  {
    slug: 'local-growth-human-context',
    name: 'Local Growth, Human Context',
    kind: 'story',
    category: 'Healthcare',
    hubs: ['healthcare', 'retail'],
    market: 'Egypt',
    sector: 'Healthcare and retail',
    role: 'Local acquisition and content direction',
    status: 'Case study',
    summary: 'Selected Egyptian healthcare and retail work, where proximity and plain language matter more than volume.',
    challenge: 'Local businesses grow through the people around them.',
    approach: ['Target by area, not by assumption.', 'Explain the service clearly; promise nothing that cannot be kept.'],
    deliverables: ['Area-targeted campaigns', 'Video and content direction'],
    skills: ['local-targeting', 'video-direction', 'content-strategy'],
    accent: '#8E8A82',
    related: ['dr-hossam-hassan', 'dr-mohamed-sadaka', 'kareem-pharmacies', 'el-gannayni-sportswear'],
    featured: 6,
  },
];

export const projectBySlug = new Map(projects.map((p) => [p.slug, p]));
export const skillById = new Map(skills.map((s) => [s.id, s]));
export const hubById = new Map(hubs.map((h) => [h.id, h]));

export const featuredStories = projects
  .filter((p) => p.kind === 'story')
  .sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99));
export const brands = projects.filter((p) => p.kind === 'brand');
export const concepts = projects.filter((p) => p.kind === 'concept');
export const miniCardSlugs = ['dahsha', 'zezewigs', 'prestige-wigs'];

export interface Chapter {
  n: string;
  id: string;
  label: string;
}

export const chapters: Chapter[] = [
  { n: '01', id: 'intro', label: 'Intro' },
  { n: '02', id: 'work', label: 'Selected Work' },
  { n: '03', id: 'impact', label: 'Impact' },
  { n: '04', id: 'expertise', label: 'Expertise' },
  { n: '05', id: 'systems', label: 'Systems & AI' },
  { n: '06', id: 'about', label: 'About' },
  { n: '07', id: 'contact', label: 'Contact' },
];

export const profile = {
  name: 'Mohamed Aman',
  edition: 'The Growth Edition',
  year: '2026',
  roles: ['Growth Strategist', 'Marketing Manager', 'Performance Marketer / Media Buyer', 'Creative Direction', 'Conversion Systems'],
  experience: '7+ years',
  markets: 'Egypt / KSA / GCC',
  tagline: 'Where strategy meets impact.',
  intro:
    'Growth strategist and performance marketing lead connecting acquisition, creative direction, commerce UX and the operations behind every conversion.',
  aboutAngle: 'Not just ads. The system around them.',
  contactLine: 'The next growth story could be yours.',
  contactArabic: 'البزنس جاهز؟',
};

export const expertise = [
  {
    title: 'Performance Marketing',
    body: 'Paid social planning and media buying for e-commerce and local services.',
    items: ['Meta Ads', 'TikTok Ads', 'Snapchat Ads', 'Local Area Targeting', 'Reporting'],
  },
  {
    title: 'Creative Direction',
    body: 'Campaign concepts and visual standards that fit the brand and the market.',
    items: ['Creative Strategy', 'Brand Identity', 'Video Campaign Direction', 'Content Strategy'],
  },
  {
    title: 'Commerce UX',
    body: 'Storefront decisions made with the ad click and the checkout in mind.',
    items: ['Salla / Zid / Shopify UX', 'Mobile hero and product journey', 'WhatsApp Journey', 'SEO URL Structure'],
  },
  {
    title: 'Systems & Operations',
    body: 'The workflows around the campaign: planning, hand-offs and reporting.',
    items: ['AI Workflow Design', 'Sales workflow architecture', 'Reporting', 'Visual Merchandising'],
  },
];

/**
 * Verified contact links. Leave EMPTY until Mohamed supplies real details.
 * Example: { label: 'Email', value: 'name@example.com', href: 'mailto:name@example.com' }
 */
export const contactLinks: { label: string; value: string; href: string }[] = [];

/**
 * UNPUBLISHED proof data. Not rendered anywhere while `approvedForPublication` is false.
 * These are total combined brand sales, NOT ad-attributed revenue.
 */
export const draftProof = {
  approvedForPublication: false,
  caveat: 'July 2026 historical snapshot. Combined brand sales, not paid-media-attributed revenue.',
  brands: ['dahsha', 'zezewigs', 'prestige-wigs'],
  figures: [
    { label: 'Combined brand sales', value: 'SAR 290,879' },
    { label: 'Total orders', value: '160' },
    { label: 'Average order value', value: '≈ SAR 1,818' },
  ],
};
