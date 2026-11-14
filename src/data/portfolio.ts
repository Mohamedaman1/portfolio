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
    label: 'E-commerce & Stores',
    summary:
      'Online stores on **Salla, Zid and Shopify** — where acquisition, creative, storefront UX and the path to purchase are run as **one system**. More than **$2M in store sales** generated across this work.',
  },
  {
    id: 'performance',
    label: 'Performance Marketing',
    summary:
      'Paid social planning, **media buying** and reporting across **Meta, TikTok and Snapchat** for e-commerce and local services.',
  },
  {
    id: 'creative',
    label: 'Creative Direction',
    summary:
      'Campaign concepts, **visual direction**, design and post-production, and **localized content** that give paid media something worth scaling.',
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    summary:
      '**Area-targeted advertising** and video campaign direction for Egyptian clinics and practitioners, **without patient claims**.',
  },
  {
    id: 'retail',
    label: 'Retail & Services',
    summary:
      'Egyptian retail, pharmacies, family services and restaurants — **launch communication**, content systems and acquisition grounded in **neighbourhood context**.',
  },
  {
    id: 'systems',
    label: 'Systems & AI',
    summary:
      'Internal **product concepts** and **workflow architecture** for sales, planning and operations. Concepts and prototypes, labelled as such.',
  },
  {
    id: 'about',
    label: 'Mohamed / About',
    summary:
      'Growth strategist and marketing manager with **7+ years** across **Egypt, Saudi Arabia and the wider GCC**.',
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
  { id: 'ugc', label: 'UGC & Short-form', hubs: ['creative', 'performance'] },
  { id: 'catalog-ops', label: 'Catalog & Variants', hubs: ['ecommerce'] },
  { id: 'measurement', label: 'Spend · Orders · VAT Reconciliation', hubs: ['performance', 'systems'] },
  { id: 'sales-enablement', label: 'Sales Enablement', hubs: ['systems'] },
  { id: 'mobile-ordering', label: 'Mobile Ordering UX', hubs: ['retail', 'ecommerce'] },
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
  /**
   * How the client is referred to in the network: by field, not by name.
   * The name itself appears only on the case-study page.
   */
  alias?: string;
  /** Brand colour — used ONLY inside this project's own art. */
  accent: string;
  /** Slugs of related projects (for stories: the brands/concepts they cover). */
  related?: string[];
  /** Order in the featured case-study list (stories only). */
  featured?: number;
  /**
   * What the work delivered or changed, stated as work (level 1), not as a measured result.
   * Measured or commercial results go in `results`, and only once approved.
   */
  outcomes?: string[];
  /** Approved, publishable results. Leave empty until Mohamed signs off. */
  results?: string[];
}

const NEUTRAL = '#8E8A82';

export const projects: Project[] = [
  /* ───────────── Premium e-commerce ───────────── */
  {
    slug: 'premium-hair-store-zid',
    alias: 'Premium wig store · Zid',
    name: 'Premium Hair Store',
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
    outcomes: ['Clearer conversion touchpoints between the ad, the product page and WhatsApp', 'A mobile hero and product journey reworked for phone shoppers'],
  },
  {
    slug: 'human-hair-wig-store',
    alias: 'Human-hair wig store · Salla',
    name: 'Human-Hair Wig Store',
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
    outcomes: ['A brand-specific creative direction, kept distinct from the other brands in the same category'],
  },
  {
    slug: 'luxury-wig-store',
    alias: 'Luxury wig store · Salla',
    name: 'Luxury Wig Store',
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
    outcomes: ['A consistent reporting format across spend, orders and channels'],
  },
  {
    slug: 'online-store-uae',
    alias: 'Online store · UAE',
    name: 'Online Store, UAE',
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
    slug: 'physiotherapy-clinic',
    alias: 'Physiotherapy clinic',
    name: 'Physiotherapy Clinic',
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
    slug: 'shoulder-physio-practice',
    alias: 'Shoulder physio practice',
    name: 'Shoulder Physiotherapy Practice',
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
    slug: 'healthcare-practice',
    alias: 'Healthcare practice',
    name: 'Healthcare Practice',
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
    slug: 'sportswear-retailer',
    alias: 'Sportswear retailer',
    name: 'Sportswear Retailer',
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
    outcomes: ['Product presentation in multiple colours and styles from the assets available'],
  },
  {
    slug: 'pharmacy-launch',
    alias: 'Pharmacy launch',
    name: 'Pharmacy Launch',
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
    outcomes: ['A reusable template system for launches, restocks and Stories'],
  },
  {
    slug: 'business-launch',
    alias: 'Business launch · Social',
    name: 'Social Business Launch',
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
    slug: 'swimming-academy',
    alias: 'Swimming academy',
    name: 'Swimming Academy',
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
    outcomes: ['Seller assessment and training flows defined — prototype, not a released product'],
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
    summary: 'A concept for unified marketing performance management. In progress as an idea.',
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
    outcomes: ['A documented order → invoice → shipment workflow, ready to build and test — not an automation in production'],
  },

  {
    slug: 'uae-fashion-footwear-store',
    name: 'Fashion & Footwear Store',
    alias: 'Fashion & footwear store · UAE',
    kind: 'brand',
    category: 'E-commerce',
    hubs: ['ecommerce', 'performance'],
    market: 'United Arab Emirates',
    sector: 'Bags and women’s footwear',
    role: 'Catalog and storefront UX direction, paid social planning',
    status: 'Live professional engagement',
    summary:
      'Catalog structure, variants and **Quick Shop** for a UAE bags and footwear store on Shopify — so a large, size-heavy range stays **easy to browse and buy on a phone**.',
    challenge: 'A catalog with many sizes, colours and categories can bury the product a shopper came for.',
    approach: [
      'Organise collections, products and variants so sizes and colours stay consistent.',
      'Shape Quick Shop and mobile add-to-cart around the way people actually browse.',
      'Plan paid social and traffic, with WhatsApp support for purchase questions.',
    ],
    deliverables: ['Collection and product structure', 'Variant and SKU consistency', 'Quick Shop and mobile cart UX', 'Paid social planning'],
    skills: ['catalog-ops', 'storefront-ux', 'whatsapp-journey'],
    accent: NEUTRAL,
    outcomes: ['A collection and variant structure that keeps sizes and colours consistent across the range'],
  },
  {
    slug: 'restaurant-ordering-ux',
    name: 'Restaurant Ordering Experience',
    alias: 'Restaurant ordering UX',
    kind: 'brand',
    category: 'Retail & Services',
    hubs: ['retail', 'ecommerce'],
    market: 'Egypt',
    sector: 'Hospitality',
    role: 'UX direction for an Arabic, mobile-first menu and ordering flow',
    status: 'Case study',
    summary:
      'Turning a local restaurant menu into a **clearer mobile ordering experience** — Arabic, right-to-left, with correct prices and a short path from choosing to ordering.',
    challenge: 'A menu that reads well on paper is hard to order from on a phone.',
    approach: [
      'Rework the menu as an Arabic, right-to-left, mobile-first layout.',
      'Make prices and options unambiguous.',
      'Shorten the path from choosing a dish to placing the order.',
    ],
    deliverables: ['Mobile menu and ordering UX', 'RTL layout direction', 'Ordering-flow definition'],
    skills: ['mobile-ordering'],
    accent: NEUTRAL,
    outcomes: ['A mobile-first, right-to-left menu and ordering flow'],
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
    summary: 'Three premium hair stores in Saudi Arabia: **one operating approach** to multibrand growth and media.',
    challenge: 'Three premium brands in the same category need distinct voices and one consistent way of working.',
    approach: [
      'Keep each brand’s identity separate in creative and storefront.',
      'Share one discipline for planning, media and reporting.',
    ],
    deliverables: ['Multibrand media operating approach', 'Per-brand creative direction', 'Shared reporting rhythm'],
    skills: ['creative-strategy', 'reporting'],
    accent: '#B8A17A',
    results: ['SAR 290,879 in combined store sales across the three stores in one month (July 2026) — total store sales, not ad-attributed revenue', '160 orders in the same month, at an average order value of about SAR 1,818'],
    related: ['premium-hair-store-zid', 'human-hair-wig-store', 'luxury-wig-store'],
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
    summary: 'A premium hair store’s mobile experience on Zid: site, video and the **WhatsApp journey designed as one path**.',
    challenge: 'Most visitors arrive on a phone. The first screen has to carry the brand and point to the next step.',
    approach: [
      'Lead with a mobile hero that carries the brand.',
      'Use video where it helps the product speak.',
      'Make WhatsApp a deliberate conversion step.',
    ],
    deliverables: ['Mobile hero direction', 'Site and video journey', 'WhatsApp conversion path'],
    skills: ['storefront-ux', 'whatsapp-journey'],
    accent: '#3F74C4',
    related: ['premium-hair-store-zid'],
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
    results: ['A Snapchat creative test: UGC drove twice the purchases of blogger creative (6 vs 3), while blogger creative cost less per order (about $127 vs $144) — a small test, read as direction', 'One messaging campaign opened 291 WhatsApp conversations in 11 days, at about $5.31 per conversation — conversations are leads, not sales'],
    related: ['premium-hair-store-zid', 'human-hair-wig-store', 'luxury-wig-store'],
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
    slug: 'local-relevance-better-conversations',
    name: 'Local Relevance. Better Conversations.',
    kind: 'story',
    category: 'Healthcare',
    hubs: ['healthcare'],
    market: 'Egypt',
    sector: 'Healthcare and physiotherapy',
    role: 'Geo media planning, messaging and asset direction',
    status: 'Case study',
    summary:
      'Physiotherapy and healthcare practices in Egypt: **relevant inquiries from the right area**, with clear explanation and responsible creative.',
    challenge: 'Clinics need inquiries from people close enough to visit, without overpromising or sharing anything about patients.',
    approach: [
      'Choose catchment areas by branch and city.',
      'Select doctor videos and service explanations that make the service understandable.',
      'Set the campaign objective, budget and the follow-up path for each inquiry.',
    ],
    deliverables: ['Area-targeted media plans', 'Doctor-video campaign assets', 'Budget and follow-up path'],
    skills: ['local-targeting', 'video-direction'],
    accent: '#8E8A82',
    related: ['physiotherapy-clinic', 'shoulder-physio-practice', 'healthcare-practice'],
    featured: 6,
    outcomes: ['Targeting plans by branch and city, with no patient data and no medical claims'],
  },
  {
    slug: 'retail-creative-built-to-repeat',
    name: 'Retail Creative Built to Repeat.',
    kind: 'story',
    category: 'Retail & Services',
    hubs: ['retail', 'creative'],
    market: 'Egypt',
    sector: 'Pharmacy and sportswear retail',
    role: 'Visual direction, campaign planning and templates',
    status: 'Case study',
    summary:
      'Pharmacy and sportswear retail: **launches and promotions that stay on-brand** every time, with realistic product presentation.',
    challenge: 'Retail runs on repeated launches and offers — each one has to look like the same brand.',
    approach: [
      'Build availability and restock templates the team can reuse.',
      'Direct opening teasers and local brand voice.',
      'Present apparel realistically on mannequins and models, in every colour.',
      'Open short-form video with a hook built for the platform.',
    ],
    deliverables: ['Template system', 'Opening teasers', 'Apparel product visuals', 'Short-form hooks'],
    skills: ['content-strategy', 'brand-identity', 'visual-merchandising'],
    accent: '#8E8A82',
    related: ['pharmacy-launch', 'sportswear-retailer'],
    featured: 7,
  },
  {
    slug: 'clarity-before-scale',
    name: 'Clarity Before Scale.',
    kind: 'story',
    category: 'E-commerce',
    hubs: ['performance', 'systems'],
    market: 'Saudi Arabia / Egypt',
    sector: 'Marketing analytics',
    role: 'Measurement design, reconciliation and reporting',
    status: 'Case study',
    summary:
      'Spend and orders spread across channels, currencies, sellers and VAT — made **readable enough to act on**.',
    challenge: 'When orders come from ads, WhatsApp, the site and payment links, every channel reports a different truth.',
    approach: [
      'Define what counts as an order, a lead and a sale — and where each is recorded.',
      'Separate WhatsApp, site and payment-link orders.',
      'Reconcile currencies (EGP / SAR / AED / USD) and gross vs. net after VAT.',
      'Review spend daily and monthly against what is left in each budget.',
    ],
    deliverables: ['Unified spend and orders report', 'Definitions sheet', 'VAT and currency logic'],
    skills: ['measurement', 'reporting'],
    accent: '#8E8A82',
    related: ['luxury-wig-store', 'premium-hair-store-zid', 'human-hair-wig-store'],
    featured: 8,
    outcomes: ['One reporting format for spend, orders and channels across brands'],
  },
  {
    slug: 'from-catalog-complexity-to-clarity',
    name: 'From Catalog Complexity to Clarity.',
    kind: 'story',
    category: 'E-commerce',
    hubs: ['ecommerce'],
    market: 'United Arab Emirates',
    sector: 'Fashion e-commerce',
    role: 'Catalog and UX operations direction',
    status: 'Case study',
    summary: 'A large bags and footwear range, organised so shoppers find **the right size and colour fast**.',
    challenge: 'Big catalogs, many sizes and categories — and shopping still has to feel effortless.',
    approach: ['Structure collections for footwear and handbags.', 'Keep variants consistent.', 'Add Quick Shop for faster buying on mobile.'],
    deliverables: ['Collection structure', 'Variant rules', 'Quick Shop'],
    skills: ['catalog-ops', 'storefront-ux'],
    accent: '#8E8A82',
    results: ['A catalog of 1,000+ SKUs organised into clear collections and variants', '191 products structured in a single footwear collection'],
    related: ['uae-fashion-footwear-store'],
    featured: 9,
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
/** Practice areas featured beside the network. Stores come first; brands are examples, not the headline. */
export const featuredAreas: { hub: HubId; title: string; meta: string; accent: string }[] = [
  {
    hub: 'ecommerce',
    title: 'E-commerce & Stores',
    meta: 'Salla · Zid · Shopify storefronts — KSA / GCC',
    accent: '#B8A17A',
  },
  { hub: 'performance', title: 'Performance Marketing', meta: 'Meta · TikTok · Snapchat media buying', accent: '#8E8A82' },
  { hub: 'systems', title: 'Systems & AI', meta: 'Sales, planning and order workflows', accent: '#8E8A82' },
];

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
    'Growth strategist and performance marketing lead connecting **acquisition**, **creative direction**, **commerce UX** and the operations behind every conversion.',
  aboutAngle: 'Not just ads. The system around them.',
  contactLine: 'The next growth story could be yours.',
};

/**
 * Headline proof, stated by Mohamed: more than $2M in store sales generated across the
 * e-commerce work, combined across stores and engagements (not a single brand or period).
 */
export const headlineProof = {
  prefix: '$',
  value: 2,
  suffix: 'M+',
  label: 'in store sales generated',
  detail: '**Combined across the e-commerce stores** managed — spread over brands and engagements, not a single store.',
};

export const expertise = [
  {
    title: 'Growth Strategy',
    body: 'From the **business problem** to audience, funnel, channel plan and the KPIs that matter.',
    items: ['Segmentation & positioning', 'Funnel design', 'Offers & value proposition', 'Budget & channel planning'],
  },
  {
    title: 'Performance Marketing',
    body: 'Campaign structures that **connect spend to commercial decisions**.',
    items: ['Meta Ads', 'TikTok Ads', 'Snapchat Ads', 'Creative testing', 'Geo & audience targeting'],
  },
  {
    title: 'Creative & Production',
    body: 'Visual storytelling shaped by **audience behaviour, product fidelity** and platform context.',
    items: ['Art direction', 'UGC & short-form', 'Hooks & captions', 'Storyboards', 'AI-assisted visuals'],
  },
  {
    title: 'Commerce & UX',
    body: 'Removing friction between **discovery, product confidence and purchase**.',
    items: ['Salla · Zid · Shopify', 'Product pages', 'Catalog & variants', 'Mobile UX', 'WhatsApp CTAs'],
  },
  {
    title: 'Analytics & Reporting',
    body: 'Making performance **readable enough to act on** — across channels, currencies and sales sources.',
    items: ['CPO · AOV · ROAS', 'Attribution gaps', 'VAT & currency', 'Excel / Google Sheets'],
  },
  {
    title: 'CRM & Operations',
    body: 'The processes and tools behind a **more consistent customer journey**.',
    items: ['WhatsApp-first funnels', 'Respond.io · ManyChat', 'Zoho CRM fields', 'Seller scripts & scorecards'],
  },
];

/** Industries first: the work grouped by sector, with brand names kept out of the headline. */
export interface Industry {
  id: string;
  name: string;
  market: string;
  challenge: string;
  work: string[];
  /** Related case studies or work pages. */
  links: string[];
  note?: string;
}

export const industries: Industry[] = [
  {
    id: 'beauty',
    name: 'Premium Beauty & Hair E-commerce',
    market: 'Saudi Arabia · GCC',
    challenge: 'A high-ticket category: buyers need trust, an accurate look at the product and a smooth path from ad to chat to checkout.',
    work: ['Multi-platform paid acquisition', 'UGC and campaign direction', 'Product pages and WhatsApp conversion', 'Reporting across brands'],
    links: ['three-brands-one-growth-discipline', 'from-storefront-to-conversion', 'culture-meets-conversion'],
  },
  {
    id: 'fashion',
    name: 'Fashion, Bags & Footwear',
    market: 'United Arab Emirates',
    challenge: 'A deep catalog of sizes, colours and categories that still has to be quick to browse and buy.',
    work: ['Catalog and variant structure', 'Quick Shop and mobile cart', 'Paid social planning'],
    links: ['from-catalog-complexity-to-clarity', 'online-store-uae'],
  },
  {
    id: 'sportswear',
    name: 'Sportswear & Apparel Retail',
    market: 'Egypt',
    challenge: 'Showing colours and sizes attractively, and selling locally on the platforms people use.',
    work: ['Apparel product visuals', 'Colour variants and retouching', 'TikTok hooks', 'Meta campaigns'],
    links: ['retail-creative-built-to-repeat', 'sportswear-retailer'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Physiotherapy',
    market: 'Egypt',
    challenge: 'Inquiries from the right area, with responsible messaging and doctor videos people can understand.',
    work: ['Area-targeted media plans', 'Doctor-video campaigns', 'Budget and follow-up path'],
    links: ['local-relevance-better-conversations'],
    note: 'No patient data, outcomes or medical claims.',
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy & Neighbourhood Retail',
    market: 'Egypt',
    challenge: 'Building a trusted local presence before and after opening, with content that repeats well.',
    work: ['Soft-opening direction', 'Launch and restock templates', 'Stories and local brand voice'],
    links: ['pharmacy-launch', 'retail-creative-built-to-repeat'],
  },
  {
    id: 'family',
    name: 'Family & Children’s Activities',
    market: 'Egypt',
    challenge: 'Convincing parents to book lessons for their children.',
    work: ['Parent segmentation', 'Monthly content plan', 'Booking calls to action'],
    links: ['swimming-academy'],
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Restaurant Ordering',
    market: 'Egypt',
    challenge: 'An Arabic menu that has to work as a phone-first ordering flow.',
    work: ['RTL mobile menu', 'Ordering-flow UX'],
    links: ['restaurant-ordering-ux'],
  },
  {
    id: 'services',
    name: 'Professional & Local Services',
    market: 'Egypt',
    challenge: 'Launching and explaining a local service, and turning attention into inquiries.',
    work: ['Social launch plans', 'Content pillars and calendar', 'Visual direction'],
    links: ['business-launch'],
  },
  {
    id: 'internal',
    name: 'Internal Tools & Operations',
    market: 'Internal',
    challenge: 'Training sellers, finding stock and moving an order from chat to invoice without re-typing.',
    work: ['Sales Compass', 'Content Planner Pro', 'Order automation architecture'],
    links: ['better-workflows-stronger-teams', 'a-smarter-sales-operation'],
    note: 'Concepts and prototypes — labelled as such.',
  },
];

/** What the work delivered, stated as work — not as measured results. */
export const deliveredOutcomes = [
  { title: 'Cross-brand reporting', body: 'Clearer reports for spend, orders, channels and VAT.' },
  { title: 'Conversion-path clarity', body: 'Friction found between the ad, the product, WhatsApp and checkout.' },
  { title: 'Brand-specific creative', body: 'Three brands in one category, each with its own identity and mood.' },
  { title: 'Mobile-first storefronts', body: 'Hero and video sizing, clearer calls to action, product and coupon cards.' },
  { title: 'Retail content variation', body: 'More product presentations and colourways from the assets available.' },
  { title: 'Sales enablement', body: 'Assessments and support material for sales teams.' },
];

export const processSteps = [
  { title: 'Diagnose', body: 'Find where the customer journey actually breaks — ad, page, chat or follow-up.' },
  { title: 'Prioritize', body: 'Fix the step that limits everything after it first.' },
  { title: 'Build', body: 'Campaigns, creative, pages and processes made for the market they serve.' },
  { title: 'Measure', body: 'Agree what counts as a lead, an order and a sale — then report it plainly.' },
  { title: 'Improve', body: 'Put budget and effort behind what has already proved itself.' },
];

/** Tools, grouped. Names only — no skill levels or percentages. */
export const toolset = [
  { group: 'Visual design & post-production', tools: ['Photoshop', 'Illustrator', 'InDesign', 'Canva', 'Premiere Pro', 'CapCut', 'DaVinci Resolve'] },
  { group: 'Code, build & AI', tools: ['HTML', 'CSS', 'JavaScript', 'GitHub', 'Cloudflare', 'Netlify', 'FFmpeg', 'Claude Code', 'ChatGPT', 'Lovable'] },
  { group: 'Advertising & measurement', tools: ['Meta Ads Manager', 'TikTok Ads Manager', 'Snapchat Ads Manager', 'Excel', 'Google Sheets'] },
  { group: 'Commerce & customer operations', tools: ['Shopify', 'Salla', 'Zid', 'WhatsApp Business', 'Respond.io', 'ManyChat', 'Zoho CRM', 'Zapier'] },
];

export const aboutCopy = {
  lede: 'I connect **acquisition, creative, commerce UX** and operational data to make growth decisions clearer and customer journeys stronger.',
  belief:
    'The strongest marketing is not the loudest campaign. It’s the clearest connection between an audience, an offer, a buying experience and the people who deliver it.',
  availability:
    'Working from Egypt with teams and businesses across Saudi Arabia, the GCC and selected local industries — for growth strategy, performance marketing, creative direction and commerce experience.',
};

/**
 * Verified contact links, supplied by Mohamed. Plain outbound links — nothing is integrated.
 */
export const contactLinks: { label: string; value: string; href: string }[] = [
  { label: 'WhatsApp', value: '+20 127 154 3918', href: 'https://wa.me/201271543918' },
  { label: 'LinkedIn', value: 'linkedin.com/in/mohamedamanr', href: 'https://www.linkedin.com/in/mohamedamanr/' },
];

/**
 * Evidence from the work, shared without client names. Each figure keeps its context and its caveat.
 */
export interface Evidence {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  context: string;
  caveat?: string;
  story?: string;
}

export const evidence: Evidence[] = [
  {
    value: 290879,
    prefix: 'SAR ',
    label: 'combined store sales in one month',
    context: 'Three premium hair stores · KSA · July 2026',
    caveat: 'Total store sales, not ad-attributed revenue',
    story: 'three-brands-one-growth-discipline',
  },
  {
    value: 160,
    label: 'orders in that month',
    context: 'Same three stores · high-ticket category',
    story: 'three-brands-one-growth-discipline',
  },
  {
    value: 1818,
    prefix: 'SAR ',
    label: 'average order value',
    context: 'Where trust and product clarity carry the sale',
    story: 'three-brands-one-growth-discipline',
  },
  {
    value: 291,
    label: 'WhatsApp conversations from one campaign',
    context: 'Premium hair e-commerce · KSA · 11 days',
    caveat: 'Conversations are leads, not sales',
    story: 'culture-meets-conversion',
  },
  {
    value: 5.31,
    prefix: '$',
    decimals: 2,
    label: 'average cost per conversation',
    context: 'Same messaging campaign',
    story: 'culture-meets-conversion',
  },
  {
    value: 2,
    suffix: '×',
    label: 'purchases from UGC vs. blogger creative',
    context: 'Snapchat creative test · 6 vs 3 purchases',
    caveat: 'Small test — bloggers cost less per order',
    story: 'culture-meets-conversion',
  },
  {
    value: 1000,
    suffix: '+',
    label: 'SKUs organised in one catalog',
    context: 'Bags & footwear · UAE · Shopify',
    story: 'from-catalog-complexity-to-clarity',
  },
  {
    value: 191,
    label: 'products in a single collection',
    context: 'Women’s footwear · UAE',
    story: 'from-catalog-complexity-to-clarity',
  },
];

/**
 * The scroll journey through the network: one stop per hub, in this order.
 * Scrolling (desktop) or the arrows (mobile) fly the camera from cluster to cluster.
 */
export interface JourneyStop {
  hub: HubId;
  headline: string;
  points: string[];
  stat?: { value: string; label: string };
  /** Short fact shown in the network caption while the camera is at this hub. */
  fact: { value: string; label: string };
  cta: { label: string; to: string };
}

export const journeyStops: JourneyStop[] = [
  {
    hub: 'ecommerce',
    fact: { value: `${headlineProof.prefix}${headlineProof.value}${headlineProof.suffix}`, label: headlineProof.label },
    headline: 'Stores that sell.',
    stat: { value: `${headlineProof.prefix}${headlineProof.value}${headlineProof.suffix}`, label: headlineProof.label },
    points: ['Salla · Zid · Shopify storefronts', 'Mobile-first product journeys', 'WhatsApp as a deliberate conversion step'],
    cta: { label: 'See the store work', to: '/#work' },
  },
  {
    hub: 'performance',
    fact: { value: '3', label: 'ad platforms: Meta · TikTok · Snapchat' },
    headline: 'Media that earns its budget.',
    points: ['Meta · TikTok · Snapchat media buying', 'Area targeting for local services', 'Decision-ready reporting'],
    cta: { label: 'What the work is made of', to: '/#expertise' },
  },
  {
    hub: 'creative',
    fact: { value: '11/11', label: 'art campaign directed for a Saudi store' },
    headline: 'Creative worth scaling.',
    points: ['Campaign concepts and art direction', 'UGC, hooks and short-form', 'Design and post-production'],
    cta: { label: 'Read the case studies', to: '/#work' },
  },
  {
    hub: 'healthcare',
    fact: { value: String(brands.filter((b) => b.category === 'Healthcare').length), label: 'clinics and practices, area-targeted' },
    headline: 'Care, communicated responsibly.',
    points: ['Area-targeted clinic campaigns', 'Educational video content', 'No patient claims, no promises'],
    cta: { label: 'Browse healthcare work', to: '/work' },
  },
  {
    hub: 'retail',
    fact: { value: String(brands.filter((b) => b.hubs[0] === 'retail').length), label: 'local retail and service brands' },
    headline: 'Local growth, human context.',
    points: ['Pharmacy launches and templates', 'Sportswear content and visuals', 'Restaurant ordering and family services'],
    cta: { label: 'Browse retail work', to: '/work' },
  },
  {
    hub: 'systems',
    fact: { value: String(concepts.length), label: 'concepts and architectures in progress' },
    headline: 'The system around the ads.',
    points: ['Sales enablement concepts', 'Planning and operations tooling', 'WhatsApp-first order architecture'],
    cta: { label: 'Concepts in progress', to: '/#systems' },
  },
  {
    hub: 'about',
    fact: { value: profile.experience, label: 'in growth and marketing' },
    headline: 'One strategist behind it.',
    stat: { value: profile.experience, label: 'across Egypt, KSA and the GCC' },
    points: ['Growth strategist', 'Marketing manager', 'Performance marketer and media buyer'],
    cta: { label: 'Meet Mohamed', to: '/#intro' },
  },
];

/** Conversation starters on the contact page. Each becomes a prefilled WhatsApp message — a plain link. */
export const contactTopics: { id: string; label: string; message: string }[] = [
  { id: 'store', label: 'Grow my online store', message: 'Hi Mohamed — I run an online store and I want to grow its sales. Can we talk?' },
  { id: 'ads', label: 'Run my paid ads', message: 'Hi Mohamed — I need someone to plan and manage my paid social campaigns. Can we talk?' },
  { id: 'storefront', label: 'Fix my storefront', message: 'Hi Mohamed — my store gets visits but not enough orders. I would like your eyes on the storefront.' },
  { id: 'creative', label: 'Direct my creative', message: 'Hi Mohamed — I am looking for creative direction for my brand and campaigns. Can we talk?' },
  { id: 'local', label: 'Fill my clinic or shop', message: 'Hi Mohamed — I run a local business and want more of the right customers nearby. Can we talk?' },
  { id: 'other', label: 'Something else', message: 'Hi Mohamed — I saw your portfolio and would like to talk about a project.' },
];
export const whatsappNumber = '201271543918';
