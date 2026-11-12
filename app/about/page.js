import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Icon from '@/components/Icon';
import InfoList, { MapEmbed, directionsUrl } from '@/components/InfoList';
import { getSettings } from '@/lib/settings';
import { pageMeta } from '@/lib/site';
import { restaurantLd, webPageLd, ldScript } from '@/lib/schema';
import { telHref } from '@/lib/format';

const DESC = 'About Himalayan Nepalese & Indian Cuisine: a family-run Nepali and Indian restaurant at 115 Wonder World Drive, San Marcos, TX. Our story, our food, hours and location.';
export const metadata = pageMeta({ title: 'About Us', description: DESC, path: '/about' });

export default async function About() {
  const s = await getSettings();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript([webPageLd({ type: 'AboutPage', name: 'About Us', description: DESC, path: '/about' }), restaurantLd(s)])} />
      <PageHero title="About Us" sub="Nepali and Indian cooking, made fresh every day in San Marcos, Texas." />
      <section className="section">
        <div className="wrap split" style={{ alignItems: 'center' }}>
          <div>
            <div className="sec-head"><h2>Our story</h2></div>
            <p className="lead">{s.story}</p>
            {s.philosophy && <p>{s.philosophy}</p>}
            <div className="btn-row" style={{ marginTop: '1.5rem' }}>
              <Link href="/menu" className="btn rust">Order Now</Link>
              {s.reservations_enabled && <Link href="/reservations" className="btn line">Make a Reservation</Link>}
            </div>
          </div>
          <img className="about-photo" src={s.about_image_url || '/about-restaurant.jpg'} alt={`Inside ${s.business_name}, San Marcos, TX`} loading="eager" />
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <div className="sec-head center"><h2>What we serve</h2><p>The dishes of Nepal and North India, cooked to order.</p></div>
          <div className="about-cards">
            <Link href="/menu" className="about-card"><span className="icon-badge"><Icon name="bag" size={22} /></span><h3>Order Now</h3><p>Momos, curries, biryani and tandoor naan. Order online and pick up at the restaurant.</p></Link>
            <Link href="/buffet" className="about-card"><span className="icon-badge"><Icon name="star" size={22} /></span><h3>Our Buffet</h3><p>See what is on the buffet today before you come in.</p></Link>
            <Link href="/reservations" className="about-card"><span className="icon-badge"><Icon name="calendar" size={22} /></span><h3>Make a Reservation</h3><p>Book a table, reserve space for an event, or ask us to cater yours.</p></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split" style={{ alignItems: 'start' }}>
          <div>
            <div className="sec-head"><h2>Visit us</h2></div>
            <InfoList s={s} />
            <div className="btn-row" style={{ marginTop: '1.5rem' }}>
              <a className="btn rust" href={directionsUrl(s)} target="_blank" rel="noopener noreferrer">Get directions</a>
              <a className="btn line" href={telHref(s.phone)}>Call us</a>
            </div>
          </div>
          <div className="map-card" style={{ marginTop: 0 }}><MapEmbed s={s} /></div>
        </div>
      </section>
    </>
  );
}
