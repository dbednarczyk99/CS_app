import type { IconType } from 'react-icons';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import type { Media, MediaName } from '@/lib/api';

const ICONS: Record<MediaName, IconType> = {
  INSTAGRAM: FaInstagram,
  FACEBOOK: FaFacebook,
  TIKTOK: FaTiktok,
  LINKEDIN: FaLinkedin,
  TWITTER: FaXTwitter,
  PINTEREST: FaPinterest,
  YOUTUBE: FaYoutube,
};

const LABELS: Record<MediaName, string> = {
  INSTAGRAM: 'Instagram',
  FACEBOOK: 'Facebook',
  TIKTOK: 'TikTok',
  LINKEDIN: 'LinkedIn',
  TWITTER: 'X',
  PINTEREST: 'Pinterest',
  YOUTUBE: 'YouTube',
};

const ORDER = Object.keys(ICONS) as MediaName[];

export function SocialLinks({ media, size = 30 }: { media: Media[]; size?: number }) {
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {[...media]
        .sort((a, b) => ORDER.indexOf(a.name) - ORDER.indexOf(b.name))
        .map((item) => {
          const Icon = ICONS[item.name];
          return (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                aria-label={LABELS[item.name]}
                className="block p-1 text-cream transition-colors hover:text-gold"
              >
                <Icon size={size} />
              </a>
            </li>
          );
        })}
    </ul>
  );
}
