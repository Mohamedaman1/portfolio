/** Renders copy with **highlighted phrases**. The highlight sweeps in when it scrolls into view. */
export default function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) =>
        i % 2 ? (
          <mark className="hl" key={i}>
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** The same copy without the markers, for places that need plain text. */
export const plain = (text: string) => text.replaceAll('**', '');
