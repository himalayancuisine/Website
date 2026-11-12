'use client';
import Icon from '@/components/Icon';

// "Save contact" button.
// Android, desktop and iPhone Safari: plain link to the .vcf file.
// iPhone Chrome / Instagram / Facebook and other non-Safari browsers often do nothing with a contact file,
// so the file is handed to Safari first; if the phone refuses the hand-off it is downloaded instead.
export default function SaveContact({ href }) {
  function onClick(e) {
    const ua = navigator.userAgent || '';
    const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!ios) return;
    const safari = /Safari\//.test(ua) && /Version\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|GSA\/|DuckDuckGo|FBAN|FBAV|FB_IAB|Instagram|Line\/|Snapchat|TikTok|musical_ly|MicroMessenger|LinkedInApp|Pinterest|Twitter/.test(ua);
    if (safari) return;

    e.preventDefault();
    const file = new URL(href, window.location.href);
    let left = false;
    const gone = () => { if (document.hidden) left = true; };
    document.addEventListener('visibilitychange', gone);
    window.addEventListener('pagehide', gone);
    window.location.href = `x-safari-${file.href}`;
    setTimeout(() => {
      document.removeEventListener('visibilitychange', gone);
      window.removeEventListener('pagehide', gone);
      if (left || document.hidden) return;
      window.location.href = `${file.pathname}?dl=1`;
    }, 1600);
  }
  return <a href={href} onClick={onClick} className="cc-btn primary"><Icon name="user" size={20} /><span>Save contact</span></a>;
}
