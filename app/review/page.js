import PageHero from '@/components/PageHero';
import ReviewChooser from '@/components/ReviewChooser';
import { getSettings } from '@/lib/settings';

export const metadata = { title: 'Share your feedback', description: 'Tell us about your visit to Himalayan Nepalese & Indian Cuisine.', robots: { index: false } };

// Point your NFC tags and table QR codes at /review.
export default async function ReviewPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero title="Share your feedback" sub="Six quick questions about your visit. Your answers help us get better every day." />
      <section className="section"><div className="wrap" style={{ maxWidth: 720 }}><ReviewChooser googleUrl={s.google_review_url} /></div></section>
    </>
  );
}
