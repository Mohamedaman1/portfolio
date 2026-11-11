import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Not found — Mohamed Aman';
  }, []);
  return (
    <div className="page page--contact">
      <header className="page__head">
        <p className="micro">
          <span className="gold">404</span> / Off the map
        </p>
        <h1>This node isn’t part of the network.</h1>
        <p className="lede lede--narrow">The page may have moved, or the address is mistyped.</p>
      </header>
      <div className="page__cta">
        <Link className="btn btn--gold" to="/">
          Back to the network <span aria-hidden="true">→</span>
        </Link>
        <Link className="btn" to="/work">
          Browse all work <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
