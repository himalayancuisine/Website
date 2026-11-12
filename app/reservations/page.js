import PageHero from '@/components/PageHero';
import Icon from '@/components/Icon';
import BookingTabs from '@/components/BookingTabs';
import ReservationForm from '@/components/ReservationForm';
import CateringForm from '@/components/CateringForm';
import { getSettings } from '@/lib/settings';
import { pageMeta } from '@/lib/site';
import { restaurantLd, webPageLd, ldScript } from '@/lib/schema';
import { telHref, timeSlots, todayISO, addDays } from '@/lib/format';

const DESC = 'Make a reservation at Himalayan Nepalese & Indian Cuisine in San Marcos, TX. Book a table online, reserve space for an event, or request catering.';
export const metadata = pageMeta({ title: 'Make a Reservation', description: DESC, path: '/reservations' });
export const dynamic = 'force-dynamic';

export default async function Reservations() {
  const s = await getSettings();
  const today = todayISO();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript([webPageLd({ name: 'Make a Reservation', description: DESC, path: '/reservations' }), restaurantLd(s)])} />
      <PageHero title="Make a Reservation" sub="Book a table, reserve space for an event, or ask us to cater yours." />
      <section className="section">
        <div className="wrap split" style={{ alignItems: 'start' }}>
          <div>
            <div className="sec-head"><h2>Reservations and Catering</h2></div>
            <p className="lead">Tell us when you would like to come and how many guests. We will confirm by phone or email.</p>
            <div className="info-item"><span className="icon-badge"><Icon name="clock" size={22} /></span><div><h3>Opening hours</h3><p className="pre">{s.hours}</p></div></div>
            <div className="info-item"><span className="icon-badge"><Icon name="pin" size={22} /></span><div><h3>Address</h3><p className="pre">{s.address}</p></div></div>
            <div className="info-item"><span className="icon-badge"><Icon name="phone" size={22} /></span><div><h3>Prefer to call?</h3><p><a href={telHref(s.phone)}>{s.phone}</a></p></div></div>
            <p className="muted">We confirm every reservation by phone or email. Your table is not held until you hear from us.</p>
          </div>
          <BookingTabs
            reserve={s.reservations_enabled
              ? <ReservationForm slots={timeSlots(s.open_time, s.close_time)} minDate={today} maxDate={addDays(today, 180)} />
              : <div className="form-card"><h3>Online reservations are paused</h3><p className="muted">Please call <a href={telHref(s.phone)}>{s.phone}</a> and we will book you in.</p></div>}
            catering={s.catering_enabled
              ? <CateringForm minDate={today} />
              : <div className="form-card"><h3>Catering requests are paused</h3><p className="muted">Please call <a href={telHref(s.phone)}>{s.phone}</a>.</p></div>}
          />
        </div>
      </section>
    </>
  );
}
