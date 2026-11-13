import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { EXIT, journey, STOPS } from './journey';

gsap.registerPlugin(ScrollTrigger);
// Mobile browsers resize the viewport as the address bar hides; do not rebuild the pin for that.
ScrollTrigger.config({ ignoreMobileResize: true });

export type JourneyMode = 'scroll' | 'step';

/**
 * One GSAP master timeline drives the whole journey: the shared `journey.pos` that the canvas reads
 * (node spread, edge geometry, camera, cluster focus) and the content panels' reveal.
 *
 *  · Normally (desktop and mobile): the exhibition is pinned and the timeline is scrubbed by scroll
 *    (ScrollTrigger pin + scrub); the arrows simply scroll to the next stop.
 *  · Reduced motion: nothing is pinned; the arrows jump the same timeline stop by stop.
 */
export function useJourney(root: RefObject<HTMLElement | null>) {
  const [stop, setStop] = useState(0);
  const [mode, setMode] = useState<JourneyMode>('step');
  const go = useRef<(i: number) => void>(() => {});

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    journey.pos = 0;
    const mm = gsap.matchMedia();

    const build = (scroll: boolean, instant: boolean) => {
      const panels = gsap.utils.toArray<HTMLElement>('.jpanel', el);
      const tl = gsap.timeline({
        paused: !scroll,
        defaults: { ease: 'none' },
        onUpdate: () => setStop(Math.min(STOPS, Math.round(journey.pos))),
        scrollTrigger: scroll
          ? {
              trigger: el,
              start: () => `top ${el.offsetTop}px`,
              // phones get a shorter journey: fewer swipes per stop
              end: () => `+=${Math.round(window.innerHeight * (window.innerWidth <= 1024 ? 0.62 : 0.9) * EXIT)}`,
              pin: true,
              scrub: 0.7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            }
          : undefined,
      });
      // 1–4: node spread, edge geometry, camera and cluster focus all read this one value
      tl.to(journey, { pos: EXIT, duration: EXIT }, 0);
      // 5: each hub's content arrives as the camera does, and leaves as it departs
      panels.forEach((p, i) => {
        const at = i + 1;
        tl.fromTo(
          p,
          { autoAlpha: 0, yPercent: 16, scale: 0.93 },
          { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.32, ease: 'power2.out' },
          at - 0.36,
        ).to(p, { autoAlpha: 0, yPercent: -14, scale: 1.04, duration: 0.3, ease: 'power2.in' }, at + 0.2);
        const bits = p.querySelectorAll('.jpanel__bit');
        tl.fromTo(
          bits,
          { autoAlpha: 0, x: 26 },
          { autoAlpha: 1, x: 0, duration: 0.16, stagger: 0.02, ease: 'power2.out' },
          at - 0.34,
        );
      });
      // the overview chrome steps aside as the journey begins, and everything clears on exit
      tl.to(el.querySelectorAll('.network__tagline, .legend'), { autoAlpha: 0, duration: 0.3 }, 0.15);
      tl.to(el.querySelectorAll('.network__caption, .network__foot'), { autoAlpha: 0, duration: 0.4 }, STOPS + 0.35);

      if (scroll) {
        go.current = (i) => {
          const st = tl.scrollTrigger;
          if (!st) return;
          const top = i <= 0 ? 0 : st.start + (st.end - st.start) * (Math.min(i, EXIT) / EXIT);
          window.scrollTo({ top, behavior: 'smooth' });
        };
      } else {
        go.current = (i) => {
          gsap.to(tl, {
            time: Math.max(0, Math.min(STOPS, i)),
            duration: instant ? 0 : 1.5,
            ease: 'power2.inOut',
            overwrite: true,
          });
        };
      }
      setMode(scroll ? 'scroll' : 'step');
      return () => {
        go.current = () => {};
      };
    };

    mm.add(
      {
        // always true, so the journey is also built where it is not pinned (touch, narrow, reduced motion)
        any: '(min-width: 0px)',
        pinned: '(prefers-reduced-motion: no-preference)',
        reduced: '(prefers-reduced-motion: reduce)',
      },
      (ctx) => {
        const { pinned, reduced } = ctx.conditions as { pinned: boolean; reduced: boolean };
        return build(pinned, reduced);
      },
    );

    return () => {
      mm.revert();
      journey.pos = 0;
    };
  }, [root]);

  const goTo = useCallback((i: number) => go.current(i), []);
  return { stop, mode, goTo };
}
