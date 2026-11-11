import { profile } from '../../data/portfolio';

export default function VerticalIdentity() {
  return (
    <div className="vertical-id" aria-hidden="true">
      <span className="vertical-id__year">{profile.year}</span>
      <span className="vertical-id__word">AMAN</span>
      <span className="vertical-id__mark">MA</span>
    </div>
  );
}
