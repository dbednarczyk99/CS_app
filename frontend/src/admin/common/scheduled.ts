/** Wpis z panelu (zasób „blog”) – pola potrzebne do listy zaplanowanych */
export interface ScheduledArticle {
  id: string;
  title: string;
  shortDescription?: string;
  publishAt: string;
  isPublished: boolean;
  sendAsNewsletter: boolean;
  newsletterSentAt?: string | null;
  images?: { src?: string }[];
  tags?: { tag: { id: string; name: string } }[];
}

/** Wpisy z przyszłą datą publikacji – od najbliższego */
export const scheduledArticles = (all: Partial<ScheduledArticle>[], now: number) =>
  (all.filter((a) => a.publishAt && new Date(a.publishAt).getTime() > now) as ScheduledArticle[]).sort((a, b) =>
    a.publishAt.localeCompare(b.publishAt),
  );
