import { profile } from '../../data/portfolio';
import { signatureUrl } from '../../lib/portrait';

/** Mohamed's handwritten signature (`src/assets/signature.*`), or a labelled typographic stand-in without it. */
export default function Signature() {
  if (signatureUrl) {
    return (
      <p className="signature">
        <img className="signature__img" src={signatureUrl} alt={`${profile.name} — signature`} width="1005" height="236" loading="lazy" />
      </p>
    );
  }
  return (
    <p className="signature" title="Typographic placeholder — the real handwritten signature will replace this">
      <span className="signature__ink">{profile.name}</span>
      <span className="micro signature__note">Signature placeholder</span>
    </p>
  );
}
