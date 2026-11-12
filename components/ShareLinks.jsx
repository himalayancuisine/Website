'use client';
import { useEffect, useState } from 'react';

// Plain share links (no tracking scripts) plus copy-link.
export default function ShareLinks({ url, title, text }) {
  const [copied, setCopied] = useState(false);
  const [native, setNative] = useState(false);
  useEffect(() => { setNative(typeof navigator !== 'undefined' && !!navigator.share); }, []);
  const u = encodeURIComponent(url), t = encodeURIComponent(title);
  const links = [
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${u}`],
    ['X', `https://twitter.com/intent/tweet?url=${u}&text=${t}`],
    ['WhatsApp', `https://wa.me/?text=${t}%20${u}`],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ['Pinterest', `https://pinterest.com/pin/create/button/?url=${u}&media=${encodeURIComponent(`${url}/cover.jpg`)}&description=${t}`],
    ['Text', `sms:?&body=${t}%20${u}`],
    ['Email', `mailto:?subject=${t}&body=${encodeURIComponent(`${text ? `${text}\n\n` : ''}${url}`)}`],
  ];
  async function share() { try { await navigator.share({ title, text: text || title, url }); } catch { /* the reader closed the share sheet */ } }
  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { window.prompt('Copy this link', url); }
  }
  return (
    <div className="share-row" aria-label="Share this article">
      <b>Share</b>
      {native && <button type="button" className="share-native" onClick={share}>Share&hellip;</button>}
      {links.map(([l, h]) => <a key={l} href={h} target={l === 'Email' || l === 'Text' ? undefined : '_blank'} rel="noopener noreferrer">{l}</a>)}
      <button type="button" onClick={copy}>{copied ? 'Link copied' : 'Copy link'}</button>
    </div>
  );
}
