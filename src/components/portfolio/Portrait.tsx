import { portraitUrl } from '../../lib/portrait';

/** Shows the real portrait when `src/assets/portrait.*` exists; otherwise a labelled placeholder. */
export default function Portrait() {
  if (portraitUrl) {
    return (
      <div className="portrait portrait--photo">
        <img src={portraitUrl} alt="Mohamed Aman in a black suit and black shirt, against a black background" width="800" height="1000" />
      </div>
    );
  }
  return (
    <div className="portrait" role="img" aria-label="Portrait placeholder — Mohamed Aman's photograph will be placed here">
      <span className="portrait__mono">MA</span>
      <span className="micro portrait__note">Portrait placeholder</span>
    </div>
  );
}
