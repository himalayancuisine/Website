import PageHero from '@/components/PageHero';
import GalleryGrid from '@/components/GalleryGrid';
import { createClient } from '@/lib/supabase/server';
import { pageMeta } from '@/lib/site';

export const metadata = pageMeta({ title: 'Gallery', description: 'Photos and videos of the food, dining room and events at Himalayan Nepalese & Indian Cuisine in San Marcos, TX.', path: '/gallery' });

export default async function Gallery() {
  const sb = await createClient();
  const { data } = await sb.from('gallery_items').select('*').order('sort_order').order('created_at', { ascending: false });
  return (
    <>
      <PageHero title="Gallery" sub="Our food, our restaurant, our events." />
      <section className="section"><div className="wrap"><GalleryGrid items={data ?? []} /></div></section>
    </>
  );
}
