import Image from 'next/image';
import { FaInstagram } from 'react-icons/fa6';
import { API_BASE_URL, api, orFallback } from '@/lib/api';
import { getContent } from '@/lib/content';
import { SectionHeading } from './SectionHeading';

/**
 * Ostatnie posty z Instagrama (zdjęcia zapisane na naszym serwerze). Gdy połączenie z Instagramem nie działa
 * – brak klucza, błąd, nieaktualne dane albo za mało postów – sekcja w ogóle się nie pokazuje.
 * Teksty: panel → Strona → Podstrony → Elementy wspólne → „Instagram – ostatnie posty”.
 */
export async function InstagramFeed({ limit = 8, className = '' }: { limit?: number; className?: string }) {
  const [feed, content] = await Promise.all([orFallback(api.instagram(), { visible: false as const }), getContent()]);
  if (!feed?.visible || feed.posts.length === 0) return null;
  const texts = content['common.instagram'];
  // pełne rzędy: 2 kolumny na telefonie, 4 na komputerze
  const posts = feed.posts.slice(0, Math.max(4, limit - (limit % 4)));
  const handle = `@${feed.username}`;

  return (
    <section aria-labelledby="instagram-posty" className={`border-t border-line py-20 md:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div id="instagram-posty">
            <SectionHeading eyebrow={texts.eyebrow} title={texts.title} />
          </div>
          <a href={feed.profileUrl} target="_blank" rel="noreferrer" className="link-arrow inline-flex items-center gap-3">
            <FaInstagram size={18} aria-hidden /> {texts.buttonLabel.replace('{profil}', handle)}
          </a>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {posts.map((post) => (
            <li key={post.id}>
              <a
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-square overflow-hidden bg-graphite"
                aria-label={`Post na Instagramie${post.caption ? `: ${post.caption.slice(0, 80)}` : ''}`}
              >
                <Image
                  src={`${API_BASE_URL}${post.image}`}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 300px, (min-width: 1024px) 24vw, 48vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 grid place-items-center bg-ink/0 text-cream opacity-0 transition-all duration-300 group-hover:bg-ink/40 group-hover:opacity-100">
                  <FaInstagram size={28} aria-hidden />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
