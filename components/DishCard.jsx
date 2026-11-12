import AddToCart from './AddToCart';
import DishImage from './DishImage';
import { money } from '@/lib/format';

// `match` is the option the guest searched for (for example "Lamb" when they typed "lamb korma"): it is highlighted and pre-selected.
export default function DishCard({ item, slug, canOrder = false, match = null }) {
  const price = item.options?.length ? `From ${money(Math.min(...item.options.map((o) => o.price)))}` : money(item.price);
  return (
    <article className="dish-card">
      <DishImage src={item.image_url} name={item.name} slug={slug} className="dish-card-img" />
      <div className="dish-card-body">
        <h3>{item.name}{item.vegetarian && <span className="veg" title="Vegetarian" />}</h3>
        {item.tags?.length > 0 && <div className="pills">{item.tags.map((t) => <span className="pill" key={t}>{t}</span>)}</div>}
        {item.description && <p>{item.description}</p>}
        {item.options?.length > 1 && (
          <ul className="dish-opts" aria-label={`${item.name} is available as`}>
            {item.options.map((o) => <li key={o.label} className={match === o.label ? 'hit' : ''}>{o.label} <span>{money(o.price)}</span></li>)}
          </ul>
        )}
        <div className="dish-card-foot">
          {canOrder ? (!item.available ? <span className="soldout">Sold out today</span> : <AddToCart item={item} prefer={match} />) : <span className="price">{price}</span>}
        </div>
      </div>
    </article>
  );
}
