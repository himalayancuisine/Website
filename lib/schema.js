import { siteUrl, SITE_NAME, MAIN_PAGES } from '@/lib/site';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Structured data (schema.org) describing the restaurant, shared by the home, about, menu and reservation pages.
export function restaurantLd(s, extra = {}) {
  const site = siteUrl();
  const closed = String(s.closed_days ?? '0').split(',').map((d) => parseInt(d, 10)).filter((d) => d >= 0 && d <= 6);
  const open = DAYS.filter((_, i) => !closed.includes(i));
  const lines = String(s.address || '').split('\n');
  const m = (lines[1] || '').match(/^(.*?),\s*([A-Za-z]{2})\s*(\d{5})?/);
  return {
    '@context': 'https://schema.org', '@type': 'Restaurant', '@id': `${site}/#restaurant`,
    name: s.business_name || SITE_NAME, url: site, image: [`${site}/opengraph-image`], logo: `${site}/logo`,
    description: 'Nepali and Indian restaurant in San Marcos, TX. Momos, curries, biryani and fresh tandoor naan. Eat in, buffet, or order online for pickup.',
    servesCuisine: ['Nepalese', 'Indian', 'Himalayan'], priceRange: '$$',
    telephone: s.phone || undefined, email: s.email || undefined,
    address: { '@type': 'PostalAddress', streetAddress: lines[0] || '115 Wonder World Drive', addressLocality: m?.[1] || 'San Marcos', addressRegion: m?.[2] || 'TX', postalCode: m?.[3] || '78666', addressCountry: 'US' },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.business_name || SITE_NAME}, ${String(s.address || '').replace(/\n/g, ', ')}`)}`,
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: open, opens: s.open_time || '12:00', closes: s.close_time || '21:00' }],
    hasMenu: `${site}/menu`, menu: `${site}/menu`, acceptsReservations: s.reservations_enabled ? `${site}/reservations` : false,
    paymentAccepted: 'Cash, Credit Card', currenciesAccepted: 'USD',
    sameAs: [s.instagram_url, s.facebook_url, ...((s.connect?.socials || []).map((l) => l?.url))].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i),
    potentialAction: [
      { '@type': 'OrderAction', name: 'Order Now', target: { '@type': 'EntryPoint', urlTemplate: `${site}/menu`, actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'] }, deliveryMethod: 'https://schema.org/OnSitePickup' },
      ...(s.reservations_enabled ? [{ '@type': 'ReserveAction', name: 'Make a Reservation', target: { '@type': 'EntryPoint', urlTemplate: `${site}/reservations`, actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'] }, result: { '@type': 'FoodEstablishmentReservation', name: 'Table reservation' } }] : []),
    ],
    ...extra,
  };
}

// Site-wide: the website itself (with menu search) and the main navigation, on every page.
export function siteLd() {
  const site = siteUrl();
  return [
    {
      '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${site}/#website`, url: site, name: SITE_NAME, alternateName: 'Himalayan San Marcos', inLanguage: 'en-US',
      publisher: { '@id': `${site}/#restaurant` },
      potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${site}/menu?q={search_term_string}` }, 'query-input': 'required name=search_term_string' },
    },
    {
      '@context': 'https://schema.org', '@type': 'ItemList', '@id': `${site}/#navigation`, name: 'Main navigation',
      itemListElement: MAIN_PAGES.map(([name, path, description], i) => ({ '@type': 'SiteNavigationElement', position: i + 1, name, description, url: `${site}${path}` })),
    },
  ];
}

// A page that is "about" the restaurant (About, Reservations...), with its breadcrumb handled by PageHero.
export const webPageLd = ({ type = 'WebPage', name, description, path }) => {
  const site = siteUrl();
  return { '@context': 'https://schema.org', '@type': type, '@id': `${site}${path}#webpage`, url: `${site}${path}`, name, description, inLanguage: 'en-US', isPartOf: { '@id': `${site}/#website` }, about: { '@id': `${site}/#restaurant` } };
};
export const ldScript = (ld) => ({ __html: JSON.stringify(ld).replace(/</g, '\\u003c') });
