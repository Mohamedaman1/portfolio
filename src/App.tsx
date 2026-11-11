import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import IndexOverlay from './components/portfolio/IndexOverlay';
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
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
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

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <ScrollManager />
      <PortfolioHeader indexOpen={indexOpen} onToggleIndex={() => setIndexOpen((v) => !v)} />
      <IndexOverlay open={indexOpen} onClose={() => setIndexOpen(false)} />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
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
