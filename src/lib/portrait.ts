/**
 * Mohamed's own media, picked up automatically from `src/assets/`:
 *   portrait.*        studio portrait (Intro / About)
 *   portrait-intro.*  tighter head-and-shoulders crop that the opening intro builds out of dots
 *   signature.*       handwritten signature (white ink, transparent background)
 *   illustration.*    illustrated portrait
 *   candid.*          informal photo
 * Any that is missing falls back to a labelled placeholder or is simply left out.
 */
const found = import.meta.glob('../assets/*.{webp,jpg,jpeg,png,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const pick = (name: string): string | undefined =>
  Object.entries(found).find(([path]) => path.split('/').pop()!.replace(/\.[^.]+$/, '') === name)?.[1];

export const portraitUrl = pick('portrait');
export const introPortraitUrl = pick('portrait-intro') ?? portraitUrl;
export const signatureUrl = pick('signature');
export const illustrationUrl = pick('illustration');
export const candidUrl = pick('candid');
