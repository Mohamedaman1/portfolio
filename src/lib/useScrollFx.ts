import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, type RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-scrubbed motion for the editorial chapters. Done with ScrollTrigger rather than CSS scroll
 * timelines so it behaves the same on phones. Everything is skipped under reduced motion.
 */
export function useScrollFx(root: RefObject<HTMLElement | null>, key: string) {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(el);
      const scrub = (target: Element, from: gsap.TweenVars, to: gsap.TweenVars, trigger: Element = target) =>
        gsap.fromTo(target, from, {
          ...to,
          ease: 'none',
          scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        });

      // headlines rise word by word out of a mask
      q('.split').forEach((h) => {
        gsap.from(h.querySelectorAll('i'), {
          yPercent: 115,
          rotate: 4,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: { trigger: h, start: 'top 88%', once: true },
        });
      });
      // giant chapter numerals and the portrait drift against the scroll
      q('.chapter__ghost').forEach((g) => scrub(g, { yPercent: 45 }, { yPercent: -45 }, g.closest('.chapter') ?? g));
      q('.portrait--photo img').forEach((img) => scrub(img, { yPercent: -7, scale: 1.14 }, { yPercent: 7, scale: 1.14 }));
      // bands of outlined type slide sideways as you scroll
      q('.scrollband__row').forEach((row, i) =>
        scrub(row, { xPercent: i % 2 ? -28 : 0 }, { xPercent: i % 2 ? 0 : -28 }, row.parentElement ?? row),
      );
      // the headline figure grows into place while gold sweeps across it
      q('.proof__figure').forEach((fig) => {
        gsap.fromTo(
          fig,
          { scale: 0.72, '--sweep': '0%' },
          {
            scale: 1,
            '--sweep': '100%',
            ease: 'none',
            scrollTrigger: { trigger: fig, start: 'top 95%', end: 'top 35%', scrub: 0.6 },
          },
        );
      });
      // a gold rule draws itself across the top of each chapter
      q('.chapter').forEach((ch) => {
        gsap.fromTo(
          ch,
          { '--line': 0 },
          { '--line': 1, ease: 'none', scrollTrigger: { trigger: ch, start: 'top 92%', end: 'top 35%', scrub: 0.5 } },
        );
      });
      // long-form lines light up word by word as they are read
      q('.reading').forEach((p) => {
        gsap.fromTo(
          p.querySelectorAll('span'),
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.08,
            scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 45%', scrub: 0.4 },
          },
        );
      });
      // groups arrive one after another, tipping up into place
      const rise = (sel: string, vars: gsap.TweenVars = {}) =>
        q(sel).forEach((group) => {
          gsap.from(group.children, {
            y: 56,
            autoAlpha: 0,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.09,
            clearProps: 'all',
            ...vars,
            scrollTrigger: { trigger: group, start: 'top 86%', once: true },
          });
        });
      rise('.principles, .facts, .rows, .case__meta, .case__body, .gallery, .contact__links');
      rise('.columns', { rotateX: -22, transformOrigin: '50% 0%', transformPerspective: 900 });
      rise('.carousel__track', { x: 90, y: 0, rotateY: -14, transformPerspective: 900, stagger: 0.12 });
      rise('.chapter > .cards, .case__related .cards', { scale: 0.92 });
      // case-study art opens like a shutter and drifts
      q('.case__art').forEach((art) => {
        gsap.fromTo(art, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power3.inOut' });
        if (art.firstElementChild) scrub(art.firstElementChild, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12 }, art);
      });
      // the closing call to action grows as it arrives
      q('.chapter--contact .chapter__head h2, .about__cta h2').forEach((h) => {
        gsap.fromTo(
          h,
          { scale: 0.8, transformOrigin: 'left center' },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: h, start: 'top 95%', end: 'top 45%', scrub: 0.5 } },
        );
      });
    });
    return () => mm.revert();
  }, [root, key]);
}
