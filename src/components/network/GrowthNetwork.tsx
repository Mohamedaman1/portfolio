import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { Orientation } from '../../data/graph';
import { headlineProof, hubs, profile } from '../../data/portfolio';
import { buildGraph, hubNodeId } from '../../lib/networkLayout';
import AccessibleNodeIndex from './AccessibleNodeIndex';
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

const GrowthNetwork = forwardRef<GrowthNetworkHandle, Props>(function GrowthNetwork({ selectedId, onSelect, active }, ref) {
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

  const hubIds = hubs.map((h) => hubNodeId(h.id));
  const hubAt = selectedId ? hubIds.indexOf(selectedId) : -1;
  /** Turn the camera to the previous / next hub. */
  const turn = (dir: number) => {
    const next = hubAt < 0 ? (dir > 0 ? 0 : hubIds.length - 1) : (hubAt + dir + hubIds.length) % hubIds.length;
    selectAndFocus(hubIds[next]);
  };
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="network" aria-label="The growth network">
      <div className="network__stage" ref={stageRef}>
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
          <div className="stepper" role="group" aria-label="Turn between hubs">
            <button type="button" onClick={() => turn(-1)} aria-label="Previous hub">
              ←
            </button>
            <p className="micro" aria-live="polite">
              <span className="gold">{hubAt >= 0 ? pad(hubAt + 1) : '––'}</span> / {pad(hubIds.length)}
              <span className="stepper__label">{hubAt >= 0 ? hubs[hubAt].label : 'Turn through the hubs'}</span>
            </p>
            <button type="button" onClick={() => turn(1)} aria-label="Next hub">
              →
            </button>
          </div>
        </div>

        <NetworkInspector detail={detail} onSelect={selectAndFocus} />

        <div className="network__foot">
          <ul className="legend" aria-label="Legend">
            <li>
              <i className="lg lg--hub" /> Hub
            </li>
            <li>
              <i className="lg lg--project" /> Project
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
            <span className="cue--mouse">Drag to explore · Scroll to zoom</span>
            <span className="cue--touch">Drag · Pinch · Tap a node</span>
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

      <nav className="network__chips" aria-label="Jump to a hub or featured project">
        {hubIds.map((id, i) => {
          const label = hubs[i].label;
          return (
            <button
              key={id}
              type="button"
              className={`chip${selectedId === id ? ' is-active' : ''}`}
              aria-pressed={selectedId === id}
              onClick={() => selectAndFocus(id)}
            >
              {label}
            </button>
          );
        })}
        <a className="chip chip--next" href="#intro">
          Continue ↓
        </a>
      </nav>
    </section>
  );
});

export default GrowthNetwork;
