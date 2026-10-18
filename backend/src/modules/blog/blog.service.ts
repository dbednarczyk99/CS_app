import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import deleteImageFiles from './../../scripts/imageHandler';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { NewsletterService } from '../newsletter/newsletter.service';

type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: {
    images: true;
    tags: {
      include: {
        tag: true;
      };
    };
  };
}>;

@Injectable()
export class BlogService {
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

  /* ----------------- GET ----------------- */

  /** onlyPublished: strona widzi tylko opublikowane; panel – wszystkie (też wpisy tylko do newslettera) */
  findAllArticles(
    onlyPublished = true,
  ): Prisma.PrismaPromise<ArticleWithRelations[]> {
    return this.prisma.article.findMany({
      where: onlyPublished ? { isPublished: true } : undefined,
      include: {
        images: { orderBy: { order: 'asc' } },
        tags: { include: { tag: true } },
      },
    });
  }

  findOneArticle(
    id: string,
    onlyPublished = true,
  ): Prisma.PrismaPromise<ArticleWithRelations | null> {
    return this.prisma.article.findFirst({
      where: { id, ...(onlyPublished ? { isPublished: true } : {}) },
      include: {
        images: { orderBy: { order: 'asc' } },
        tags: { include: { tag: true } },
      },
    });
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
    if (article.sendAsNewsletter) this.sendNewsletter(article.id);
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
    if (updated.sendAsNewsletter && !updated.newsletterSentAt)
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
