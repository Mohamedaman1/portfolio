import { useEffect, useRef } from 'react';
import { profile } from '../../data/portfolio';
import { signatureUrl } from '../../lib/portrait';

/**
 * Mohamed's handwritten signature (`src/assets/signature.*`). It writes itself in, left to right,
 * each time it scrolls into view. Without the asset, a labelled typographic stand-in is shown.
 */
export default function Signature() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      el?.classList.add('is-written');
      return;
    }
    const io = new IntersectionObserver(([entry]) => el.classList.toggle('is-written', entry.isIntersecting), {
      threshold: 0.6,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (signatureUrl) {
    return (
      <p className="signature signature--real" ref={ref}>
        <img className="signature__img" src={signatureUrl} alt={`${profile.name} — signature`} width="1005" height="236" />
        <span className="signature__pen" aria-hidden="true" />
      </p>
    );
  }
  return (
    <p className="signature" ref={ref} title="Typographic placeholder — the real handwritten signature will replace this">
      <span className="signature__ink">{profile.name}</span>
      <span className="micro signature__note">Signature placeholder</span>
    </p>
  );
}
