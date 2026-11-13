/** A paragraph whose words light up one by one as it is scrolled through. */
export default function Reading({ text, className = '' }: { text: string; className?: string }) {
  return (
    <p className={`reading ${className}`} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span aria-hidden="true" key={i}>
          {w}{' '}
        </span>
      ))}
    </p>
  );
}
