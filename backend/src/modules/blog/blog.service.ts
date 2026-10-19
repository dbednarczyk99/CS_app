import {
  Injectable,
  BadRequestException,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import deleteImageFiles from './../../scripts/imageHandler';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { NewsletterService } from '../newsletter/newsletter.service';
import { slugify, uniqueSlug } from '../../scripts/slug';

@Injectable()
export class BlogService implements OnApplicationBootstrap {
  constructor(
    private prisma: PrismaService,
    private newsletter: NewsletterService,
  ) {}

  /** Wysyłka do newslettera w tle (raz na artykuł) – błąd poczty nie blokuje zapisu artykułu */
  private sendNewsletter(articleId: string) {
    this.newsletter
      .sendArticle(articleId)
      .catch((error: unknown) =>
        this.logger.error(
          `Newsletter dla artykułu ${articleId} nie wysłany`,
          error as Error,
        ),
      );
  }
  private readonly logger = new Logger(BlogService.name);

  /** Wolny adres wpisu z tytułu („Jesienne promocje” → jesienne-promocje) */
  private articleSlug(title: string) {
    return uniqueSlug(
      slugify(title, 90, 'wpis'),
      async (slug) =>
        !!(await this.prisma.article.findUnique({ where: { slug } })),
    );
  }

  /** Przy starcie: adresy dla wpisów bez sluga (dodanych przed wprowadzeniem czytelnych adresów) */
  async onApplicationBootstrap() {
    const missing = await this.prisma.article.findMany({
      where: { slug: null },
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true },
    });
    for (const a of missing)
      await this.prisma.article.update({
        where: { id: a.id },
        data: { slug: await this.articleSlug(a.title) },
      });
    if (missing.length)
      this.logger.log(`Nadano adresy (slug) wpisom: ${missing.length}`);
  }

  /* ----------------- GET ----------------- */

  /** Widoczne na stronie: opublikowane, a zaplanowane – dopiero od czasu publikacji */
  private visibleNow(): Prisma.ArticleWhereInput {
    return {
      isPublished: true,
      OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }],
    };
  }

  /** Data publikacji widoczna na stronie: zaplanowana albo dodania */
  private withPublishedAt<
    T extends { publishAt: Date | null; createdAt: Date },
  >(article: T) {
    return { ...article, publishedAt: article.publishAt ?? article.createdAt };
  }

  /** onlyPublished: strona widzi tylko opublikowane; panel – wszystkie (też wpisy tylko do newslettera i zaplanowane) */
  async findAllArticles(onlyPublished = true) {
    const articles = await this.prisma.article.findMany({
      where: onlyPublished ? this.visibleNow() : undefined,
      include: {
        images: { orderBy: { order: 'asc' } },
        tags: { include: { tag: true } },
      },
    });
    return articles.map((a) => this.withPublishedAt(a));
  }

  /** Wpis po adresie na stronie (slug) albo po id – stare linki z id (np. w wysłanych newsletterach) przekierowuje strona */
  async findOneArticle(idOrSlug: string, onlyPublished = true) {
    const article = await this.prisma.article.findFirst({
      where: {
        AND: [
          { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
          onlyPublished ? this.visibleNow() : {},
        ],
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        tags: { include: { tag: true } },
      },
    });
    return article && this.withPublishedAt(article);
  }

  /** Wpis zaplanowany na później – bez wysyłki newslettera przy zapisie (wyśle ją zadanie co minutę) */
  private isScheduled(article: { publishAt: Date | null }) {
    return article.publishAt !== null && article.publishAt > new Date();
  }

  /** Co minutę: wysyłka newslettera dla wpisów, których czas publikacji właśnie minął */
  @Cron(CronExpression.EVERY_MINUTE)
  async sendScheduled() {
    const due = await this.prisma.article.findMany({
      where: {
        sendAsNewsletter: true,
        newsletterSentAt: null,
        publishAt: { lte: new Date() },
      },
      select: { id: true },
    });
    for (const { id } of due) this.sendNewsletter(id);
  }

  /* ----------------- CREATE ----------------- */

  async createArticle(dto: CreateArticleDto) {
    const { images, tags, ...rest } = dto as any;

    const tagNames = (tags || []).map((t: any) =>
      (typeof t === 'string' ? t : t.name).trim(),
    );

    const imagesData = (images || []).map(
      (img: { imgUrl: string; order?: number }, index: number) => ({
        imgUrl: img.imgUrl,
        order: img.order ?? index,
      }),
    );

    const article = await this.prisma.article.create({
      data: {
        ...rest,
        slug: await this.articleSlug(rest.title as string),
        publishAt: rest.publishAt ? new Date(rest.publishAt as string) : null,
        images: {
          create: imagesData,
        },
        tags: {
          create: tagNames.map((name: string) => ({
            tag: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        },
      },
      include: {
        images: true,
        tags: { include: { tag: true } },
      },
    });
    if (article.sendAsNewsletter && !this.isScheduled(article))
      this.sendNewsletter(article.id);
    return article;
  }

  /* ----------------- UPDATE ----------------- */

  async updateArticle(id: string, dto: UpdateArticleDto) {
    const existing = await this.prisma.article.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      throw new BadRequestException('Article not found');
    }

    const { images, tags, ...rest } = dto as any;

    const data: Prisma.ArticleUpdateInput = {
      ...(rest.title !== undefined ? { title: rest.title } : {}),
      ...(rest.shortDescription !== undefined
        ? { shortDescription: rest.shortDescription }
        : {}),
      ...(rest.content !== undefined ? { content: rest.content } : {}),
      ...(rest.sendAsNewsletter !== undefined
        ? { sendAsNewsletter: rest.sendAsNewsletter }
        : {}),
      ...(rest.isPublished !== undefined
        ? { isPublished: rest.isPublished }
        : {}),
      // zmiana terminu możliwa tylko przed wysyłką newslettera (wysłanego nie da się cofnąć)
      ...(rest.publishAt !== undefined && !existing.newsletterSentAt
        ? {
            publishAt: rest.publishAt
              ? new Date(rest.publishAt as string)
              : null,
          }
        : {}),
    };

    /* -------- TAGI -------- */

    if (Array.isArray(tags)) {
      await this.prisma.tagOnArticle.deleteMany({
        where: { articleId: id },
      });

      const tagNames = tags.map((t: any) =>
        (typeof t === 'string' ? t : t.name).trim(),
      );

      data.tags = {
        create: tagNames.map((name: string) => ({
          tag: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      };
    }

    /* -------- OBRAZKI -------- */

    let urlsToDelete: string[] = [];

    if (Array.isArray(images)) {
      const newUrls = images
        .filter((img) => img?.imgUrl)
        .map((img) => img.imgUrl as string);

      const oldUrls = existing.images.map((img) => img.imgUrl);

      urlsToDelete = oldUrls.filter((url) => !newUrls.includes(url));

      data.images = {
        deleteMany: {},
        create: newUrls.map((url, index) => ({
          imgUrl: url,
          order: index,
        })),
      };
    }

    const updated = await this.prisma.article.update({
      where: { id },
      data,
      include: {
        images: true,
        tags: { include: { tag: true } },
      },
    });

    if (urlsToDelete.length > 0) {
      await deleteImageFiles(urlsToDelete);
    }

    // flaga włączona, a artykuł jeszcze nie wysłany (np. zapisany wcześniej bez wysyłki) – wysyłka teraz
    if (
      updated.sendAsNewsletter &&
      !updated.newsletterSentAt &&
      !this.isScheduled(updated)
    )
      this.sendNewsletter(id);

    return updated;
  }

  /* ----------------- DELETE ----------------- */

  async deleteArticle(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!article) {
      throw new BadRequestException('Article not found');
    }

    const imgUrls = article.images.map((img) => img.imgUrl);

    // powiązania (tagi, zdjęcia) muszą zniknąć przed artykułem – inaczej błąd FK
    await this.prisma.$transaction([
      this.prisma.tagOnArticle.deleteMany({ where: { articleId: id } }),
      this.prisma.articleImages.deleteMany({ where: { articleId: id } }),
      this.prisma.article.delete({ where: { id } }),
    ]);

    if (imgUrls.length > 0) {
      await deleteImageFiles(imgUrls);
    }

    return article;
  }
}
