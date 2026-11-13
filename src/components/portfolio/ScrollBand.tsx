/** A band of oversized type that slides sideways with the scroll. Decorative. */
export default function ScrollBand({ rows }: { rows: string[][] }) {
  return (
    <div className="scrollband" aria-hidden="true">
      {rows.map((words, r) => (
        <div className="scrollband__row" key={r}>
          {[...words, ...words].map((w, i) => (
            <span key={i} className={i % 3 === 1 ? 'is-solid' : undefined}>
              {w}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
