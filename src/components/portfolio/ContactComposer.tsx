import { useEffect, useState } from 'react';
import { contactLinks, contactTopics, whatsappNumber } from '../../data/portfolio';
import { illustrationUrl } from '../../lib/portrait';

/**
 * Conversation starter: pick a topic and the first message writes itself.
 * The button is a plain wa.me link carrying that text — nothing is sent from this site.
 */
export default function ContactComposer({ compact = false }: { compact?: boolean }) {
  const [topic, setTopic] = useState(contactTopics[0]);
  const [typed, setTyped] = useState(topic.message);

  useEffect(() => {
    const full = topic.message;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(full);
      return;
    }
    let i = 0;
    setTyped('');
    const id = window.setInterval(() => {
      i += 2;
      setTyped(full.slice(0, i));
      if (i >= full.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [topic]);

  const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(topic.message)}`;
  const linkedin = contactLinks.find((l) => l.label === 'LinkedIn');
  const done = typed.length >= topic.message.length;

  return (
    <div className={`composer${compact ? ' composer--compact' : ''}`}>
      <div className="composer__pick">
        <p className="micro">
          <span className="gold">01</span> / What do you need?
        </p>
        <div className="composer__topics" role="group" aria-label="Choose a topic">
          {contactTopics.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`topic${t.id === topic.id ? ' is-active' : ''}`}
              aria-pressed={t.id === topic.id}
              onClick={() => setTopic(t)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="composer__chat">
        <p className="micro">
          <span className="gold">02</span> / Your first message, already written
        </p>
        <div className="chat" aria-live="polite">
          <div className="chat__status">
            {illustrationUrl && <img className="chat__avatar" src={illustrationUrl} alt="" width="36" height="36" />}
            <span className="chat__dot" />
            <span className="micro">Mohamed Aman · WhatsApp</span>
          </div>
          <p className="chat__bubble chat__bubble--in">
            <span className="chat__typing" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="sr">Waiting for your message</span>
          </p>
          <p className="chat__bubble chat__bubble--out">
            <span aria-hidden="true">
              {typed}
              {!done && <span className="chat__caret" />}
            </span>
            <span className="sr">{topic.message}</span>
          </p>
        </div>
        <div className="composer__send">
          <a className={`send${done ? ' is-ready' : ''}`} href={href} target="_blank" rel="noopener noreferrer">
            <span className="send__rings" aria-hidden="true" />
            Send on WhatsApp <span aria-hidden="true">↗</span>
          </a>
          {linkedin && (
            <a className="btn" href={linkedin.href} target="_blank" rel="noopener noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
        <p className="micro composer__note">Opens WhatsApp with this text. You can edit it before sending.</p>
      </div>
    </div>
  );
}
