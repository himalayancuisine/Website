'use client';
import { useState } from 'react';
import Link from 'next/link';
import ActionForm, { SubmitButton } from './ActionForm';
import { submitFeedback } from '@/app/actions';

const WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];
const VISITS = ['Dine-in', 'Pickup order', 'Buffet', 'Catering'];
const AREAS = [['food', 'Food and taste'], ['service', 'Service and staff'], ['clean', 'Cleanliness'], ['value', 'Value for money']];
const AGAIN = ['Yes', 'Maybe', 'No'];

// One row of five stars. `big` is the overall rating at the top of the form.
function Stars({ name, label, value, onChange, big = false, required = false }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className={`bf-stars${big ? '' : ' sm'}`} onMouseLeave={() => setHover(0)} role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <label key={n} className={n <= shown ? 'on' : ''} onMouseEnter={() => setHover(n)}>
          <input type="radio" name={name} value={n} checked={value === n} onChange={() => onChange(n)} required={required} />
          <span aria-hidden="true">&#9733;</span><span className="sr">{label}: {n} {n === 1 ? 'star' : 'stars'}, {WORDS[n]}</span>
        </label>
      ))}
      <b className="bf-word" aria-live="polite">{WORDS[shown]}</b>
    </div>
  );
}

// The feedback form (NFC tags and table QR codes point here).
// Everything is saved to the dashboard and emailed to the restaurant. After sending:
// 5 stars overall: the guest is invited to post a Google review (link set in Dashboard > Settings).
// 1 to 4 stars: the guest is thanked and told it goes to the kitchen. Nothing is published.
export default function ReviewChooser({ googleUrl }) {
  const [rating, setRating] = useState(0);
  const [areas, setAreas] = useState({});
  const [len, setLen] = useState(0);
  const [done, setDone] = useState(0); // the overall rating that was sent

  if (done === 5) return (
    <div className="form-card fb-card fb-done">
      <div className="fb-badge" aria-hidden="true">&#9733;</div>
      <h2>Thank you. We are so glad you enjoyed it.</h2>
      {googleUrl ? (
        <>
          <p>Would you share that on Google too? A short review helps other people in San Marcos find us, and it takes under a minute.</p>
          <div className="btn-row"><a className="btn rust" href={googleUrl} target="_blank" rel="noopener noreferrer">Write a Google review</a><Link className="btn line" href="/">Back to the site</Link></div>
        </>
      ) : (
        <>
          <p>Five stars means a lot to our whole team. We hope to see you again soon.</p>
          <div className="btn-row"><Link className="btn rust" href="/menu">See the menu</Link><Link className="btn line" href="/">Back to the site</Link></div>
        </>
      )}
    </div>
  );
  if (done) return (
    <div className="form-card fb-card fb-done">
      <div className="fb-badge" aria-hidden="true">&#10003;</div>
      <h2>Thank you for your feedback.</h2>
      <p>Your answers have gone straight to our kitchen team. We read every one and we will work on it.</p>
      <div className="btn-row"><Link className="btn rust" href="/menu">See the menu</Link><Link className="btn line" href="/">Back to the site</Link></div>
    </div>
  );

  return (
    <ActionForm className="form-card fb-card" action={async (a, fd) => { const r = await submitFeedback(a, fd); if (r?.ok) { setDone(Number(fd.get('rating')) || 1); window.scrollTo({ top: 0 }); } return r; }}>
      <p className="req-note"><b>*</b> Required. It takes about a minute.</p>

      <fieldset className="fb-q req">
        <legend><span className="fb-n">1</span>Overall, how was your visit?</legend>
        <Stars big name="rating" label="Overall rating" value={rating} onChange={setRating} required />
      </fieldset>

      <fieldset className="fb-q">
        <legend><span className="fb-n">2</span>How did you visit us?</legend>
        <div className="fb-chips">{VISITS.map((v) => <label key={v} className="chip-radio"><input type="radio" name="visit" value={v} /><span>{v}</span></label>)}</div>
      </fieldset>

      <fieldset className="fb-q">
        <legend><span className="fb-n">3</span>How would you rate each of these?</legend>
        <div className="fb-areas">
          {AREAS.map(([key, label]) => (
            <div key={key} className="fb-area"><span>{label}</span><Stars name={key} label={label} value={areas[key] || 0} onChange={(n) => setAreas((x) => ({ ...x, [key]: n }))} /></div>
          ))}
        </div>
      </fieldset>

      <fieldset className="fb-q">
        <legend><span className="fb-n">4</span>Would you come back or recommend us?</legend>
        <div className="fb-chips">{AGAIN.map((v) => <label key={v} className="chip-radio"><input type="radio" name="again" value={v} /><span>{v}</span></label>)}</div>
      </fieldset>

      <div className="fb-q">
        <label className="fb-label" htmlFor="f-msg"><span className="fb-n">5</span>{rating && rating < 5 ? 'What could we have done better?' : 'Anything you would like to tell us?'}</label>
        <textarea id="f-msg" name="message" rows={4} maxLength={1500} placeholder="A dish you loved, something that went wrong, an idea for us..." onChange={(e) => setLen(e.target.value.length)} />
        <p className="hint fb-count">{len} / 1500</p>
      </div>

      <div className="fb-q">
        <p className="fb-label"><span className="fb-n">6</span>Your details <small>Optional, only if you would like a reply</small></p>
        <div className="form-grid">
          <div className="field"><label htmlFor="f-name">Name</label><input id="f-name" name="name" maxLength={80} placeholder="Your name" autoComplete="off" /></div>
          <div className="field"><label htmlFor="f-email">Email</label><input id="f-email" name="email" type="email" maxLength={120} placeholder="you@example.com" autoComplete="off" /></div>
        </div>
      </div>

      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <SubmitButton className="btn rust fb-send" pendingText="Sending...">Send feedback</SubmitButton>
      <p className="hint" style={{ textAlign: 'center', marginBottom: 0 }}>Your answers go to our team. They are not posted online.</p>
    </ActionForm>
  );
}
