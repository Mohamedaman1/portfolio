import { profile } from '../../data/portfolio';
import { signatureUrl } from '../../lib/portrait';

/** Side strip: the name runs upward as an endless ticker, and the handwritten signature writes itself in. */
export default function VerticalIdentity() {
  const run = (
    <span className="vertical-id__run">
      <b>AMAN</b>
      <i>AMAN</i>
      <b>AMAN</b>
      <i>AMAN</i>
    </span>
  );
  return (
    <div className="vertical-id" aria-hidden="true">
      <span className="vertical-id__year">{profile.year}</span>
      <div className="vertical-id__viewport">
        <div className="vertical-id__track">
          {run}
          {run}
        </div>
      </div>
      {signatureUrl ? (
        <span className="vertical-id__sig">
          <img src={signatureUrl} alt="" />
        </span>
      ) : (
        <span className="vertical-id__mark">MA</span>
      )}
    </div>
  );
}
