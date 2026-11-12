import './globals.css';
import { Cormorant_Garamond, Figtree } from 'next/font/google';
import { CartProvider } from '@/components/CartProvider';
import SiteChrome from '@/components/SiteChrome';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { getSession } from '@/lib/auth';
import { siteUrl } from '@/lib/site';
import { siteLd, ldScript } from '@/lib/schema';

const display = Cormorant_Garamond({ weight: ['500', '600', '700'], subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Figtree({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

const site = siteUrl();

export const metadata = {
  metadataBase: new URL(site),
  title: { default: 'Himalayan Nepalese & Indian Cuisine | Restaurant in San Marcos, TX', template: '%s | Himalayan San Marcos' },
  description: 'Nepali and Indian restaurant at 115 Wonder World Drive, San Marcos, TX. Momos, curries, biryani and fresh tandoor naan. Eat in or order online for pickup.',
  applicationName: 'Himalayan Nepalese & Indian Cuisine',
  keywords: ['Nepalese restaurant San Marcos', 'Indian restaurant San Marcos TX', 'momos', 'Indian buffet San Marcos', 'biryani', 'tikka masala', 'Himalayan food'],
  openGraph: { type: 'website', siteName: 'Himalayan Nepalese & Indian Cuisine', locale: 'en_US' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  formatDetection: { telephone: true, address: true, email: true },
  twitter: { card: 'summary_large_image' },
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#2b1810', colorScheme: 'light' };

export default async function RootLayout({ children }) {
  // An administrator signed in on this browser cannot place orders.
  const { isAdmin } = await getSession();
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable}`}>
      <body><script type="application/ld+json" dangerouslySetInnerHTML={ldScript(siteLd())} /><CartProvider blocked={isAdmin}>
          <SiteChrome header={<Header />} footer={<Footer />} drawer={<CartDrawer />}>{children}</SiteChrome>
        </CartProvider></body>
    </html>
  );
}
