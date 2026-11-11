/** Reserved slot for the real portrait at /media/mohamed-portrait.webp. No face is generated or implied. */
export default function Portrait() {
  return (
    <div className="portrait" role="img" aria-label="Portrait placeholder — Mohamed Aman's photograph will be placed here">
      <span className="portrait__mono">MA</span>
      <span className="micro portrait__note">Portrait placeholder</span>
    </div>
  );
}
