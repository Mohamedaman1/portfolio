import { useCallback, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import IndexOverlay from './components/portfolio/IndexOverlay';
import IntroOverlay from './components/portfolio/IntroOverlay';
import { useScrollReveal } from './lib/useScrollReveal';
import { useScrollFx } from './lib/useScrollFx';
import Cursor from './components/portfolio/Cursor';
import PortfolioHeader from './components/portfolio/PortfolioHeader';
import SiteFooter from './components/portfolio/SiteFooter';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import WorkDetail from './pages/WorkDetail';
import WorkIndex from './pages/WorkIndex';

const TITLES: Record<string, string> = {
  '/': 'Mohamed Aman — The Growth Edition',
  '/work': 'Work — Mohamed Aman',
  '/about': 'About — Mohamed Aman',
  '/contact': 'Contact — Mohamed Aman',
};

/** Scroll to the hash target, or to the top on new navigations. Back/forward keeps the browser's position. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const type = useNavigationType();
  useEffect(() => {
    if (TITLES[pathname]) document.title = TITLES[pathname];
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      requestAnimationFrame(() => {
        if (id === 'top') window.scrollTo(0, 0);
        else document.getElementById(id)?.scrollIntoView();
      });
    } else if (type !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, type]);
  return null;
}

export default function App() {
  const [indexOpen, setIndexOpen] = useState(false);
  const { pathname, hash } = useLocation();
  useEffect(() => setIndexOpen(false), [pathname, hash]);
  useScrollReveal(pathname);
  const main = useRef<HTMLElement>(null);
  useScrollFx(main, pathname);

  // The opening sequence plays once per browser session, on the home page only.
  const [intro, setIntro] = useState(() => {
    try {
      return (
        pathname === '/' &&
        !hash &&
        !sessionStorage.getItem('ma-intro') &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    } catch {
      return false;
    }
  });
  const endIntro = useCallback(() => {
    try {
      sessionStorage.setItem('ma-intro', '1');
    } catch {
      /* private mode: just play it again next time */
    }
    setIntro(false);
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      {intro && <IntroOverlay onDone={endIntro} />}
      <ScrollManager />
      <PortfolioHeader indexOpen={indexOpen} onToggleIndex={() => setIndexOpen((v) => !v)} />
      <IndexOverlay open={indexOpen} onClose={() => setIndexOpen(false)} />
      <Cursor />
      {/* a gold sweep marks each page change */}
      <div className="wipe" key={pathname} aria-hidden="true" />
      <main id="main" ref={main}>
        <Routes>
          <Route path="/" element={<Home introDone={!intro} />} />
          <Route path="/work" element={<WorkIndex />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}
