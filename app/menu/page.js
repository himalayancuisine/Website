import OrderMenu from '@/components/OrderMenu';
import OrderSteps from '@/components/OrderSteps';
import { createClient } from '@/lib/supabase/server';
import { getSettings } from '@/lib/settings';
import { pageMeta, siteUrl, SITE_NAME } from '@/lib/site';
import { ldScript } from '@/lib/schema';

const DESC = 'Order now from Himalayan Nepalese & Indian Cuisine in San Marcos, TX. Full menu with prices: momos, tikka masala, biryani, tandoor naan and more. Order online for pickup.';
export const metadata = pageMeta({ title: 'Order Now: Menu and Online Ordering', description: DESC, path: '/menu' });

export default async function MenuPage() {
  const sb = await createClient();
  const s = await getSettings();
  const [{ data: cats }, { data: items }] = await Promise.all([
    sb.from('menu_categories').select('*').eq('visible', true).order('sort_order'),
    sb.from('menu_items').select('*').order('sort_order'),
  ]);
  const shown = (cats || []).filter((c) => items?.some((i) => i.category_id === c.id));

  // Menu structured data: sections and dishes with prices, so search engines can read the whole menu.
  const site = siteUrl();
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'Menu', '@id': `${site}/menu#menu`, name: `${SITE_NAME} menu`, url: `${site}/menu`, inLanguage: 'en-US',
      hasMenuSection: shown.map((c) => ({
        '@type': 'MenuSection', name: c.name, ...(c.description ? { description: c.description } : {}),
        hasMenuItem: (items || []).filter((i) => i.category_id === c.id).map((i) => {
          const price = i.options?.length ? Math.min(...i.options.map((o) => Number(o.price) || 0)) : Number(i.price);
          return {
            '@type': 'MenuItem', name: i.name, ...(i.description ? { description: i.description } : {}), ...(i.image_url ? { image: i.image_url } : {}),
            ...(i.vegetarian ? { suitableForDiet: 'https://schema.org/VegetarianDiet' } : {}),
            ...(price > 0 ? { offers: { '@type': 'Offer', price: price.toFixed(2), priceCurrency: 'USD' } } : {}),
          };
        }),
      })),
    },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Home', site], ['Order Now', `${site}/menu`]].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) },
  ];

  return (
    <div className="order-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(ld)} />
      <div className="wrap order-head">
        <h1>Order Now</h1>
        <p className="muted">Fresh to order for pickup. <span className="veg" style={{ margin: '0 6px 0 4px' }} />Vegetarian. Please tell us about allergies.</p>
        <OrderSteps current={1} />
        {!s.accepting_orders && <div className="error">We are not taking online orders right now. Please call {s.phone}.</div>}
      </div>
      <OrderMenu cats={shown} items={items || []} canOrder={s.accepting_orders} />
    </div>
  );
}
