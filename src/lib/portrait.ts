/**
 * Drop Mohamed's real photo at `src/assets/portrait.webp` (or .jpg / .jpeg / .png).
 * It is picked up automatically: the opening intro builds it out of dots and the
 * Intro / About sections show it. With no file present, labelled placeholders are used.
 */
const found = import.meta.glob('../assets/portrait.{webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export const portraitUrl: string | undefined = Object.values(found)[0];
