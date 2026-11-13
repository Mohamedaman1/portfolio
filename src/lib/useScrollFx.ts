import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, type RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-scrubbed motion for the editorial chapters. Done with ScrollTrigger rather than CSS scroll
 * timelines so it behaves the same on phones. Everything is skipped under reduced motion.
 */
export function useScrollFx(root: RefObject<HTMLElement | null>) {
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
      // cards and rows arrive one after another
      q('.columns, .principles, .facts, .rows').forEach((group) => {
        gsap.from(group.children, {
          y: 46,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: 'top 86%', once: true },
        });
      });
    });
    return () => mm.revert();
  }, [root]);
}
