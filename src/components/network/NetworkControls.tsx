interface Props {
  onZoomIn(): void;
  onZoomOut(): void;
  onReset(): void;
  onToggleList(): void;
  listOpen: boolean;
}

export default function NetworkControls({ onZoomIn, onZoomOut, onReset, onToggleList, listOpen }: Props) {
  return (
    <div className="net-controls" role="group" aria-label="Network controls">
      <button type="button" onClick={onToggleList} aria-expanded={listOpen} aria-controls="node-index">
        List
      </button>
      <button type="button" onClick={onZoomOut} aria-label="Zoom out">
        −
      </button>
      <button type="button" onClick={onZoomIn} aria-label="Zoom in">
        +
      </button>
      <button type="button" onClick={onReset} aria-label="Reset view">
        Reset
      </button>
    </div>
  );
}
