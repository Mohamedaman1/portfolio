import { profile } from '../../data/portfolio';

/**
 * Typographic stand-in. Replace with the real handwriting asset at /media/mohamed-signature.svg
 * (see README) — this is NOT Mohamed's authentic signature.
 */
export default function Signature() {
  return (
    <p className="signature" title="Typographic placeholder — the real handwritten signature will replace this">
      <span className="signature__ink">{profile.name}</span>
      <span className="micro signature__note">Signature placeholder</span>
    </p>
  );
}
