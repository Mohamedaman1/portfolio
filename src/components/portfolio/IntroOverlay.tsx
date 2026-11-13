import { useEffect, useRef, useState } from 'react';
import { profile } from '../../data/portfolio';
import { introPortraitUrl } from '../../lib/portrait';
import Signature from './Signature';

interface Dot {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  r: number;
  delay: number;
  vx: number;
  vy: number;
  gold: boolean;
}

const GATHER = 1700;
const HOLD = 900;
const BURST = 800;
const TOTAL = GATHER + HOLD + BURST;

function loadImage(url: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/** Build a halftone: one dot per grid cell, sized by brightness. Source is the photo, or the MA monogram. */
async function sampleFigure(cols: number): Promise<{ cols: number; rows: number; cells: Float32Array }> {
  const rows = Math.round(cols * 1.25);
  const c = document.createElement('canvas');
  c.width = cols;
  c.height = rows;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  g.fillStyle = '#000';
  g.fillRect(0, 0, cols, rows);
  const img = introPortraitUrl ? await loadImage(introPortraitUrl) : null;
  if (img) {
    const s = Math.max(cols / img.width, rows / img.height);
    const w = img.width * s;
    const h = img.height * s;
    g.filter = 'grayscale(1) contrast(1.3) brightness(0.98)';
    g.drawImage(img, (cols - w) / 2, (rows - h) * 0.3, w, h);
  } else {
    await Promise.race([
      document.fonts?.load(`800 ${cols}px "Archivo Variable"`) ?? Promise.resolve(),
      new Promise((r) => setTimeout(r, 700)),
    ]);
    g.fillStyle = '#fff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `800 ${cols * 0.56}px "Archivo Variable", Arial, sans-serif`;
    g.fillText('MA', cols / 2, rows / 2);
  }
  const data = g.getImageData(0, 0, cols, rows).data;
  const cells = new Float32Array(cols * rows);
  for (let i = 0; i < cells.length; i++) {
    cells[i] = (data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114) / 255;
  }
  return { cols, rows, cells };
}

/**
 * Opening sequence: scattered network dots gather into Mohamed's portrait (or the MA monogram
 * until the photo is added), hold, then burst outward as the site opens. Any click or key skips it.
 */
export default function IntroOverlay({ onDone }: { onDone(): void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let dead = false;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setLeaving(true);
      setTimeout(() => done.current(), 450);
    };
    const skip = () => finish();
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    document.body.classList.add('no-scroll');

    (async () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const figH = Math.min(h * 0.74, w * 0.92 * 1.25, 760);
      const cols = w < 720 ? 72 : 112;
      const fig = await sampleFigure(cols);
      if (dead) return;
      const cell = figH / fig.rows;
      const ox = w / 2 - (fig.cols * cell) / 2;
      const oy = h * 0.47 - figH / 2;
      let seed = 7;
      const rnd = () => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
      };
      const dots: Dot[] = [];
      for (let y = 0; y < fig.rows; y++) {
        for (let x = 0; x < fig.cols; x++) {
          const l = fig.cells[y * fig.cols + x];
          if (l < 0.06) continue;
          const tx = ox + (x + 0.5) * cell;
          const ty = oy + (y + 0.5) * cell;
          const a = Math.atan2(ty - h / 2, tx - w / 2) + (rnd() - 0.5) * 0.9;
          const speed = 0.6 + rnd() * 1.6;
          dots.push({
            sx: rnd() * w,
            sy: rnd() * h,
            tx,
            ty,
            r: Math.max(0.4, cell * 0.56 * Math.pow(l, 1.15)),
            delay: rnd() * 0.45,
            vx: Math.cos(a) * speed,
            vy: Math.sin(a) * speed,
            gold: rnd() < 0.025,
          });
        }
      }
      // a few "edges" so the scattered state reads as the network, not noise
      const links: [number, number][] = [];
      for (let i = 0; i < 170 && dots.length > 2; i++) {
        links.push([Math.floor(rnd() * dots.length), Math.floor(rnd() * dots.length)]);
      }
      const px = new Float32Array(dots.length);
      const py = new Float32Array(dots.length);
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const start = performance.now();

      const frame = (now: number) => {
        if (dead) return;
        const t = now - start;
        const burst = Math.max(0, t - GATHER - HOLD);
        const bp = Math.min(1, burst / BURST);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i];
          const g = ease(Math.min(1, Math.max(0, (t / GATHER - d.delay) / (1 - 0.45))));
          let x = d.sx + (d.tx - d.sx) * g;
          let y = d.sy + (d.ty - d.sy) * g;
          if (burst > 0) {
            const k = bp * bp * Math.max(w, h) * 0.75;
            x += d.vx * k;
            y += d.vy * k;
          } else if (g >= 1) {
            x += Math.sin(now / 600 + i) * 0.35;
          }
          px[i] = x;
          py[i] = y;
        }
        const settle = Math.min(1, t / GATHER);
        const lineAlpha = burst > 0 ? 0.22 * (1 - bp) : 0.26 * (1 - settle * 0.92);
        if (lineAlpha > 0.01) {
          ctx.beginPath();
          for (const [a, b] of links) {
            ctx.moveTo(px[a], py[a]);
            ctx.lineTo(px[b], py[b]);
          }
          ctx.strokeStyle = `rgba(244,241,235,${lineAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
        ctx.globalAlpha = 1 - bp * 0.85;
        for (const gold of [false, true]) {
          ctx.beginPath();
          for (let i = 0; i < dots.length; i++) {
            if (dots[i].gold !== gold) continue;
            const r = dots[i].r;
            ctx.moveTo(px[i] + r, py[i]);
            ctx.arc(px[i], py[i], r, 0, 6.2832);
          }
          ctx.fillStyle = gold ? '#B8A17A' : '#F4F1EB';
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        if (countRef.current) {
          countRef.current.textContent = String(Math.min(100, Math.round((t / (GATHER + HOLD)) * 100))).padStart(3, '0');
        }
        if (t >= TOTAL - 350) finish();
        if (t < TOTAL + 400) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    })();

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return (
    <div className={`intro-overlay${leaving ? ' is-leaving' : ''}`} role="presentation">
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="intro-overlay__sig">
        <Signature />
      </div>
      <div className="intro-overlay__bar">
        <p className="micro">
          {profile.name} <span aria-hidden="true">/</span> {profile.edition}
        </p>
        <p className="micro intro-overlay__count" aria-hidden="true">
          <span ref={countRef}>000</span> — Assembling the network
        </p>
        <p className="micro intro-overlay__skip">Click or press any key to skip</p>
      </div>
    </div>
  );
}
