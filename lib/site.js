// The public address of the website, used for share cards (Open Graph), the sitemap and links in emails.
// Uses NEXT_PUBLIC_SITE_URL when set (https:// is added if you forgot it), otherwise the address Vercel gives
// the project, so share links never point at localhost.
export function siteUrl() {
  let e = String(process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '');
  if (e && !/^https?:\/\//i.test(e)) e = `https://${e}`;
  if (e) return e;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export const SITE_NAME = 'Himalayan Nepalese & Indian Cuisine';

// Metadata for an inner page: canonical address plus complete Open Graph and Twitter tags.
// (A page that sets its own openGraph no longer inherits the default share image, so it is listed here.)
export function pageMeta({ title, description, path, image = '/opengraph-image' }) {
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { type: 'website', url: path, title: `${title} | ${SITE_NAME}`, description, siteName: SITE_NAME, locale: 'en_US', images: [{ url: image, width: 1200, height: 630, alt: SITE_NAME }] },
    twitter: { card: 'summary_large_image', title: `${title} | ${SITE_NAME}`, description, images: [image] },
  };
}

// The pages we want search engines to treat as the main destinations (used for the footer and structured data).
export const MAIN_PAGES = [
  ['About Us', '/about', 'Our story, our kitchen and where to find us in San Marcos, TX.'],
  ['Our Buffet', '/buffet', "See what is on the buffet today."],
  ['Order Now', '/menu', 'Browse the full menu and order online for pickup.'],
  ['Make a Reservation', '/reservations', 'Book a table or ask about catering and private events.'],
  ['Gallery', '/gallery', 'Photos and videos of our food and restaurant.'],
  ['Blog', '/blog', 'Stories, recipes and news from our kitchen.'],
];
