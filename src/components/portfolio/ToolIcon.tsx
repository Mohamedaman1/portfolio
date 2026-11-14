/**
 * Original monogram tiles for tools and languages, drawn in the site's own style.
 * Each tool keeps a hint of its familiar colour; no third-party logo artwork is used.
 */
const TOOLS: Record<string, { mark: string; color: string }> = {
  Photoshop: { mark: 'Ps', color: '#31A8FF' },
  Illustrator: { mark: 'Ai', color: '#FF9A00' },
  InDesign: { mark: 'Id', color: '#FF3366' },
  'Premiere Pro': { mark: 'Pr', color: '#9999FF' },
  Canva: { mark: 'Cv', color: '#00C4CC' },
  CapCut: { mark: 'Cc', color: '#F4F1EB' },
  'DaVinci Resolve': { mark: 'Dr', color: '#F2B84B' },
  HTML: { mark: '</>', color: '#E34F26' },
  CSS: { mark: '{ }', color: '#2965F1' },
  JavaScript: { mark: 'JS', color: '#F7DF1E' },
  GitHub: { mark: 'Gh', color: '#F4F1EB' },
  Cloudflare: { mark: 'Cf', color: '#F38020' },
  Netlify: { mark: 'Nf', color: '#32E6E2' },
  FFmpeg: { mark: 'Ff', color: '#5CB85C' },
  'Claude Code': { mark: 'Cl', color: '#D97757' },
  ChatGPT: { mark: 'Gp', color: '#10A37F' },
  Lovable: { mark: 'Lv', color: '#FF5C8A' },
  'Meta Ads Manager': { mark: 'Me', color: '#0081FB' },
  'TikTok Ads Manager': { mark: 'Tk', color: '#FE2C55' },
  'Snapchat Ads Manager': { mark: 'Sc', color: '#FFFC00' },
  Excel: { mark: 'Xl', color: '#21A366' },
  'Google Sheets': { mark: 'Gs', color: '#34A853' },
  Shopify: { mark: 'Sh', color: '#95BF47' },
  Salla: { mark: 'Sa', color: '#76E3CF' },
  Zid: { mark: 'Zd', color: '#9B7BFF' },
  'WhatsApp Business': { mark: 'Wa', color: '#25D366' },
  'Respond.io': { mark: 'Ri', color: '#4F8BFF' },
  ManyChat: { mark: 'Mc', color: '#3D9BFF' },
  'Zoho CRM': { mark: 'Zo', color: '#E42527' },
  Zapier: { mark: 'Zp', color: '#FF4F00' },
};

export default function ToolIcon({ name }: { name: string }) {
  const t = TOOLS[name] ?? { mark: name.slice(0, 2), color: '#B8A17A' };
  return (
    <span className="tool" style={{ ['--tool' as string]: t.color }}>
      <span className="tool__tile" aria-hidden="true">
        <span className="tool__mark">{t.mark}</span>
      </span>
      <span className="tool__name">{name}</span>
    </span>
  );
}
