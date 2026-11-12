'use client';
import { useEffect, useMemo, useState } from 'react';
import DishCard from './DishCard';
import CartPanel from './CartPanel';
import Icon from './Icon';

const norm = (v) => String(v || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Standard ordering layout: search box, category pills and dish cards on the left, a sticky cart on the right.
export default function OrderMenu({ cats, items, canOrder }) {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  // /menu?q=momo opens with the search filled in (used by the site search link in Google).
  useEffect(() => { const v = new URLSearchParams(window.location.search).get('q'); if (v) setQ(v.slice(0, 60)); }, []);

  const words = norm(q).split(/\s+/).filter(Boolean);
  const catName = useMemo(() => Object.fromEntries(cats.map((c) => [c.id, c.name])), [cats]);
  const match = (i) => { const hay = norm(`${i.name} ${i.description || ''} ${(i.tags || []).join(' ')} ${catName[i.category_id] || ''} ${i.vegetarian ? 'vegetarian veg' : ''}`); return words.every((w) => hay.includes(w)); };
  const searching = words.length > 0;
  const groups = cats
    .filter((c) => searching || cat === 'all' || c.slug === cat)
    .map((c) => [c, items.filter((i) => i.category_id === c.id && (!searching || match(i)))])
    .filter(([, list]) => list.length);
  const count = groups.reduce((n, [, l]) => n + l.length, 0);

  return (
    <div className="wrap order-layout">
      <div className="order-main">
        <div className="menu-search" role="search">
          <Icon name="search" size={20} />
          <label className="sr" htmlFor="menu-q">Search the menu</label>
          <input id="menu-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes, e.g. momo, paneer, biryani" maxLength={60} autoComplete="off" enterKeyHint="search" />
          {q && <button type="button" onClick={() => setQ('')} aria-label="Clear search">&times;</button>}
        </div>
        {searching
          ? <p className="menu-count" aria-live="polite">{count ? `${count} ${count === 1 ? 'dish' : 'dishes'} for "${q.trim()}"` : `No dishes match "${q.trim()}".`}</p>
          : (
            <div className="cat-pills" role="group" aria-label="Menu categories">
              <button type="button" className="chip" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>All</button>
              {cats.map((c) => <button type="button" key={c.id} className="chip" aria-pressed={cat === c.slug} onClick={() => setCat(c.slug)}>{c.name}</button>)}
            </div>
          )}
        {searching && !count && <p className="muted">Try a shorter word, or <button type="button" className="linkish" onClick={() => setQ('')}>see the whole menu</button>.</p>}
        {groups.map(([c, list]) => (
          <section key={c.id} id={`m-${c.slug}`} className="cat">
            <h2>{c.name}</h2>
            {c.description && !searching && <p>{c.description}</p>}
            <div className="dish-grid">
              {list.map((i) => <DishCard key={i.id} item={i} slug={c.slug} canOrder={canOrder} />)}
            </div>
          </section>
        ))}
      </div>
      <CartPanel />
    </div>
  );
}
