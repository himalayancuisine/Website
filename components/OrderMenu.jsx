'use client';
import { useEffect, useMemo, useState } from 'react';
import DishCard from './DishCard';
import CartPanel from './CartPanel';
import Icon from './Icon';

const norm = (v) => String(v || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
// Light word tidy-up so plurals and common spellings match: momos > momo, curries > curry, veggie/vegetable/vegetarian > veg.
const ALIAS = { veggie: 'veg', vegetable: 'veg', vegetarian: 'veg', chilly: 'chilli', chili: 'chilli', chile: 'chilli', biriyani: 'biryani', briyani: 'biryani', nan: 'naan', daal: 'dal', dhal: 'dal', kebab: 'kabab', kebob: 'kabab', prawn: 'shrimp', mutton: 'goat', panir: 'paneer', lassie: 'lassi', chai: 'tea', chowmein: 'chow', noodle: 'chow' };
const stem = (w) => { let x = w; if (x.length > 4 && x.endsWith('ies')) x = `${x.slice(0, -3)}y`; else if (x.length > 3 && x.endsWith('s') && !x.endsWith('ss')) x = x.slice(0, -1); return ALIAS[x] || x; };
const toks = (v) => norm(v).split(/[^a-z0-9]+/).filter(Boolean).map(stem);
const VEG = ['veg'];
// A typed word matches a dish word when the dish word starts with it ("bir" finds biryani) or, for longer words, contains it.
const hit = (t, w) => t.startsWith(w) || (w.length >= 4 && t.includes(w));

// Standard ordering layout: search box, category pills and dish cards on the left, a sticky cart on the right.
export default function OrderMenu({ cats, items, canOrder }) {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  // /menu?q=momo opens with the search filled in (used by the site search link in Google).
  useEffect(() => { const v = new URLSearchParams(window.location.search).get('q'); if (v) setQ(v.slice(0, 60)); }, []);

  // Search the way guests type: "lamb korma" finds Korma because Lamb is one of its options; "momos" finds Momo;
  // "vegetarian" finds every vegetarian dish. Every word typed must be found somewhere on the dish.
  const words = norm(q).split(/[^a-z0-9]+/).filter(Boolean).map(stem);
  const searching = words.length > 0;
  const catName = useMemo(() => Object.fromEntries(cats.map((c) => [c.id, c.name])), [cats]);
  const index = useMemo(() => items.map((i) => {
    const opts = (i.options || []).map((o) => ({ label: o.label, words: toks(o.label) }));
    const optWords = opts.flatMap((o) => o.words);
    const vegOpt = optWords.some((w) => VEG.includes(w));
    const base = toks(`${i.name} ${i.description || ''} ${(i.tags || []).join(' ')} ${catName[i.category_id] || ''} ${(i.addons || []).map((a) => a.label).join(' ')}`);
    return { item: i, name: toks(i.name), opts, all: [...base, ...optWords, ...(i.vegetarian || vegOpt ? VEG : [])] };
  }), [items, catName]);

  const found = useMemo(() => {
    const out = new Map();
    if (!searching) return out;
    for (const e of index) {
      if (!words.every((w) => e.all.some((t) => hit(t, w)))) continue;
      // Which option did they ask for? The first option that one of their words names.
      const opt = e.opts.find((o) => words.some((w) => o.words.some((t) => hit(t, w))));
      // Best matches first: more of the typed words in the dish name ranks higher.
      const score = words.filter((w) => e.name.some((t) => hit(t, w))).length;
      out.set(e.item.id, { match: opt?.label || null, score });
    }
    return out;
  }, [index, searching, q]); // eslint-disable-line react-hooks/exhaustive-deps

  const groups = cats
    .filter((c) => searching || cat === 'all' || c.slug === cat)
    .map((c) => [c, items.filter((i) => i.category_id === c.id && (!searching || found.has(i.id))).sort((x, y) => (searching ? found.get(y.id).score - found.get(x.id).score : 0))])
    .filter(([, list]) => list.length)
    .sort((x, y) => (searching ? Math.max(...y[1].map((i) => found.get(i.id).score)) - Math.max(...x[1].map((i) => found.get(i.id).score)) : 0));
  const count = groups.reduce((n, [, l]) => n + l.length, 0);

  return (
    <div className="wrap order-layout">
      <div className="order-main">
        <div className="menu-search" role="search">
          <Icon name="search" size={20} />
          <label className="sr" htmlFor="menu-q">Search the menu</label>
          <input id="menu-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search, e.g. lamb korma, veg momo, garlic naan" maxLength={60} autoComplete="off" enterKeyHint="search" />
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
              {list.map((i) => <DishCard key={i.id} item={i} slug={c.slug} canOrder={canOrder} match={found.get(i.id)?.match || null} />)}
            </div>
          </section>
        ))}
      </div>
      <CartPanel />
    </div>
  );
}
