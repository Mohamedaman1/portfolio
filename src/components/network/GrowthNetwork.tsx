import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { Orientation } from '../../data/graph';
import { headlineProof, hubs, journeyStops, profile } from '../../data/portfolio';
import type { JourneyMode } from '../../lib/useJourney';
import { buildGraph } from '../../lib/networkLayout';
import AccessibleNodeIndex from './AccessibleNodeIndex';
import JourneyPanels from './JourneyPanels';
import { describeNode } from './describe';
import NetworkCanvas, { type NetworkHandle } from './NetworkCanvas';
import NetworkControls from './NetworkControls';
import NetworkInspector from './NetworkInspector';

export interface GrowthNetworkHandle {
  focus(id: string): void;
}

interface Props {
  selectedId: string | null;
  onSelect(id: string | null): void;
  /** False while the opening intro is still covering the page. */
  active: boolean;
  /** Current journey stop (0 = overview) and how to travel. */
  stop: number;
  mode: JourneyMode;
  goTo(stop: number): void;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

const GrowthNetwork = forwardRef<GrowthNetworkHandle, Props>(function GrowthNetwork(
  { selectedId, onSelect, active, stop, mode, goTo },
  ref,
) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<NetworkHandle>(null);
  const [orientation, setOrientation] = useState<Orientation>('landscape');
  const [compact, setCompact] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const canvasSupported = useMemo(
    () => typeof document !== 'undefined' && !!document.createElement('canvas').getContext,
    [],
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width < 2 || height < 2) return;
      setOrientation(width / height < 0.95 ? 'portrait' : 'landscape');
      setCompact(width < 720);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const graph = useMemo(() => buildGraph(orientation), [orientation]);
  const detail = useMemo(() => (selectedId ? describeNode(graph, selectedId) : null), [graph, selectedId]);

  useImperativeHandle(ref, () => ({ focus: (id) => canvasRef.current?.focus(id) }), []);

  /** Selection coming from DOM controls: select and bring the node into view. */
  const selectAndFocus = useCallback(
    (id: string | null) => {
      onSelect(id);
      setListOpen(false);
      if (id) canvasRef.current?.focus(id);
    },
    [onSelect],
  );
  /** Selection coming from the canvas: only move the camera if the inspector would cover the node. */
  const selectFromCanvas = useCallback(
    (id: string | null) => {
      onSelect(id);
      if (id) requestAnimationFrame(() => canvasRef.current?.reveal(id));
    },
    [onSelect],
  );
  const closeList = useCallback(() => setListOpen(false), []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const total = journeyStops.length;
  const atStop = stop > 0 ? hubs.find((h) => h.id === journeyStops[stop - 1].hub)! : null;
  /** Arrows travel the journey. Past the last stop, continue into the page. */
  const travel = (dir: number) => {
    onSelect(null);
    if (dir > 0 && stop >= total) {
      if (mode === 'scroll') goTo(total + 1.05);
      else document.getElementById('intro')?.scrollIntoView();
    } else goTo(stop + dir);
  };
  const stepper = (className: string) => (
    <div className={className} role="group" aria-label="Travel through the network">
      <button type="button" onClick={() => travel(-1)} disabled={stop === 0} aria-label="Previous stop">
        ←
      </button>
      <p className="micro" aria-live="polite">
        <span className="gold">{stop > 0 ? pad(stop) : '00'}</span> / {pad(total)}
        <span className="stepper__label">{atStop ? atStop.label : mode === 'scroll' ? 'Scroll to begin' : 'Start the tour'}</span>
      </p>
      <button
        type="button"
        className={stop === 0 ? 'is-inviting' : undefined}
        onClick={() => travel(1)}
        aria-label={stop >= total ? 'Continue to the page' : 'Next stop'}
      >
        {stop >= total ? '↓' : '→'}
      </button>
    </div>
  );

  return (
    <section className="network" aria-label="The growth network">
      <div className={`network__stage${stop > 0 ? ' is-travelling' : ''}`} ref={stageRef}>
        {canvasSupported ? (
          <NetworkCanvas
            ref={canvasRef}
            graph={graph}
            selectedId={selectedId}
            onSelect={selectFromCanvas}
            reducedMotion={reducedMotion}
            active={active}
            insetRight={compact ? 0 : 340}
            insetBottom={compact ? 220 : 0}
            journeyRight={compact ? 0 : 430}
            journeyBottom={compact ? 250 : 0}
          />
        ) : (
          <p className="network__fallback">The interactive network needs Canvas support. Use the list below to browse the work.</p>
        )}

        <div className="network__caption">
          <p className="micro">
            {profile.name} <span aria-hidden="true">/</span> {profile.edition}
          </p>
          <p className="network__tagline">{profile.tagline}</p>
          <p className="network__proof">
            <strong>
              {headlineProof.prefix}
              {headlineProof.value}
              {headlineProof.suffix}
            </strong>{' '}
            {headlineProof.label}
          </p>
          {stepper('stepper stepper--top')}
        </div>

        <ol className="jdots" aria-hidden="true">
          {journeyStops.map((s, i) => (
            <li key={s.hub} className={i + 1 === stop ? 'is-on' : i + 1 < stop ? 'is-done' : undefined} />
          ))}
        </ol>
        <JourneyPanels stop={stop} />
        <NetworkInspector detail={detail} onSelect={selectAndFocus} />

        <div className="network__foot">
          <ul className="legend" aria-label="Legend">
            <li>
              <i className="lg lg--hub" /> Hub
            </li>
            <li>
              <i className="lg lg--project" /> Client
            </li>
            <li>
              <i className="lg lg--concept" /> Concept
            </li>
            <li>
              <i className="lg lg--story" /> Case study
            </li>
            <li>
              <i className="lg lg--edge" /> Connection
            </li>
          </ul>
          <p className="micro network__cue">
            <span className="cue--mouse">
              {mode === 'scroll' ? 'Scroll to travel' : 'Use the arrows to travel'} · Drag to explore
            </span>
            <span className="cue--touch">Drag · Tap a node</span>
          </p>
          <NetworkControls
            onZoomIn={() => canvasRef.current?.zoom(1.35)}
            onZoomOut={() => canvasRef.current?.zoom(1 / 1.35)}
            onReset={() => {
              canvasRef.current?.reset();
              onSelect(null);
            }}
            onToggleList={() => setListOpen((v) => !v)}
            listOpen={listOpen}
          />
        </div>

        <AccessibleNodeIndex open={listOpen || !canvasSupported} onClose={closeList} onSelect={selectAndFocus} />
      </div>

      {/* Small screens: where you are in the journey, with arrows as a second way to move. */}
      <div className="network__tour">
        {stepper('stepper stepper--tour')}
        {stop === 0 && mode === 'scroll' ? (
          <p className="network__hint micro">
            <span className="network__hint-line" aria-hidden="true" /> Scroll to travel the network
          </p>
        ) : (
          <a className="network__skip micro" href="#intro">
            Skip to the page ↓
          </a>
        )}
      </div>
    </section>
  );
});

export default GrowthNetwork;
