import { ImageResponse } from 'next/og';
import { createPublicClient } from '@/lib/supabase/public';

export const dynamic = 'force-dynamic';

// The picture used when an article is shared (Facebook, WhatsApp, X, LinkedIn, iMessage...).
// Share previews are picky: they want a JPEG or PNG of a known size (1200 x 630) that is not too heavy.
// So the article's cover photo is cropped and saved as a light JPEG here, whatever was uploaded (WebP, huge photo...).
// With no cover photo a branded card with the article title is drawn instead.
const HEAD = { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' };

function card(title) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#2b1810', padding: 72, color: '#fff', borderBottom: '16px solid #ffd21a' }}>
        <div style={{ display: 'flex', fontSize: 34, letterSpacing: 6, color: '#ffd21a', textTransform: 'uppercase' }}>Himalayan Blog</div>
        <div style={{ display: 'flex', fontSize: title.length > 70 ? 60 : 78, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        <div style={{ display: 'flex', fontSize: 32, color: '#e6d9cf' }}>Nepalese &amp; Indian Cuisine · San Marcos, TX</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

export async function GET(_req, { params }) {
  const { slug } = await params;
  let post = null;
  try { ({ data: post } = await createPublicClient().from('posts').select('title,cover_url').eq('slug', slug).maybeSingle()); } catch {}
  const title = post?.title || 'Himalayan Nepalese & Indian Cuisine';

  if (post?.cover_url && /^https?:\/\//.test(post.cover_url)) {
    try {
      const r = await fetch(post.cover_url, { signal: AbortSignal.timeout(8000) });
      if (r.ok) {
        const sharp = (await import('sharp')).default;
        const jpg = await sharp(Buffer.from(await r.arrayBuffer())).rotate().resize(1200, 630, { fit: 'cover', position: 'attention' }).flatten({ background: '#2b1810' }).jpeg({ quality: 78, mozjpeg: true }).toBuffer();
        return new Response(jpg, { headers: { 'Content-Type': 'image/jpeg', ...HEAD } });
      }
    } catch {}
  }
  // No cover (or it could not be read): a drawn card. Converted to JPEG when possible so the address and the file type agree.
  const png = Buffer.from(await card(title).arrayBuffer());
  try {
    const sharp = (await import('sharp')).default;
    return new Response(await sharp(png).jpeg({ quality: 85 }).toBuffer(), { headers: { 'Content-Type': 'image/jpeg', ...HEAD } });
  } catch { return new Response(png, { headers: { 'Content-Type': 'image/png', ...HEAD } }); }
}
