/** Splits a headline into masked words so it can rise in word by word. Reads normally to assistive tech. */
export default function Split({ text }: { text: string }) {
  return (
    <span className="split" aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span aria-hidden="true" key={i}>
          <span className="split__w">
            <i>{w}</i>
          </span>{' '}
        </span>
      ))}
    </span>
  );
}
