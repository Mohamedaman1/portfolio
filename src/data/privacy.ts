/** Privacy policy text. Plain data, so the page and the build-time static copy always say the same thing. */
export const PRIVACY_UPDATED = '24 November 2026';

export type Block = { p: string } | { ul: string[] };

export interface PrivacySection {
  id: string;
  title: string;
  blocks: Block[];
}

export const privacySections: PrivacySection[] = [
  {
    id: 'summary',
    title: 'In short',
    blocks: [
      {
        p: 'This is a personal portfolio. It does not ask for your name or email, has no sign-in, no contact form, no cookies and no analytics or advertising trackers. I do not collect, sell or share personal data through this site.',
      },
    ],
  },
  {
    id: 'collect',
    title: 'What this site collects',
    blocks: [
      { p: 'Nothing that identifies you. Specifically, the site:' },
      {
        ul: [
          'sets no cookies and uses no local storage;',
          'remembers one thing for the length of your visit, in your browser only: that the opening animation has already played, so it does not repeat. It is cleared when you close the tab and is never sent anywhere;',
          'loads its fonts, images and code from the site itself — no third-party fonts, scripts, maps or embeds;',
          'has no forms, accounts, comments or newsletter.',
        ],
      },
    ],
  },
  {
    id: 'hosting',
    title: 'Hosting and technical logs',
    blocks: [
      {
        p: 'The site is served as static files by GitHub Pages, and its domain name is handled by a domain registrar. Like any web host, they may process technical data needed to deliver the pages, such as your IP address, browser type and the pages requested, in their own server logs. I do not receive or use that data. Their handling is governed by their own policies.',
      },
    ],
  },
  {
    id: 'links',
    title: 'Links to other services',
    blocks: [
      {
        p: 'The contact options open WhatsApp and LinkedIn in a new tab. Nothing is sent until you choose to send it there. When you use them, that service’s own privacy policy applies, and what you write reaches me through it.',
      },
      {
        p: 'The WhatsApp button on the Contact page only opens a chat with a ready-made first line. The text is built in your browser and passed in the link; it is not stored or seen by this site, and you can edit it before sending.',
      },
    ],
  },
  {
    id: 'messages',
    title: 'If you message me',
    blocks: [
      {
        p: 'If you contact me, I use what you send only to reply and to discuss the work you asked about. I do not add you to a mailing list or pass your details on. You can ask me to delete the conversation at any time.',
      },
    ],
  },
  {
    id: 'work',
    title: 'Client work shown here',
    blocks: [
      {
        p: 'Projects are described by sector and market, without naming clients, and without patient, customer or account data. If you believe something here describes your business and you would like it changed or removed, tell me and I will do it.',
      },
    ],
  },
  {
    id: 'rights',
    title: 'Your choices',
    blocks: [
      {
        p: 'Because the site holds no personal data about you, there is nothing to access, correct or delete here. For anything you have sent me directly, you can ask to see it, correct it or have it deleted.',
      },
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this page',
    blocks: [
      { p: 'If the site ever starts collecting anything, this page will be updated first. The date at the top shows the latest version.' },
    ],
  },
];
