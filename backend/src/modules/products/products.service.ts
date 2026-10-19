import { Cron, CronExpression } from '@nestjs/schedule';
import {
  Injectable,
  Logger,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Category, Product } from '@prisma/client';
import deleteImageFiles from './../../scripts/imageHandler';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateLabelDto, UpdateLabelDto } from './dto/label.dto';
import { isLabelActive, withPromo } from './promo';
import { warsawNow } from '../reservations/reservation-rules';

// zdjęcia w kolejności, kategoria i etykiety (w kolejności z panelu) – w każdej odpowiedzi z produktem
const PRODUCT_INCLUDE = {
  images: { orderBy: { order: 'asc' } },
  category: true,
  labels: { orderBy: [{ order: 'asc' }, { name: 'asc' }] },
} satisfies Prisma.ProductInclude;

/** „Wegańskie!” → „weganskie” – adres filtra w ofercie (?etykiety=weganskie) */
const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 36) || 'etykieta';

type PromoInput = {
  price?: number;
  isPromo?: boolean;
  promoPrice?: number | null;
  promoFrom?: string | null;
  promoTo?: string | null;
};

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Co minutę: zaplanowane zmiany dostępności (od początku wybranego dnia, czas polski; dzisiejsza data – od razu).
   * „Dostępny od” – aktywny (a sezonowy w sezonie), „Niedostępny od” –
   * sezonowy poza sezon, zwykły ukryty. Po wykonaniu data się czyści, więc przełączniki zostają jedynym stanem
   * (ręczna zmiana w panelu działa od razu, a zaplanowana – o swojej porze).
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async applySchedule() {
    const today = warsawNow().date;
    const due = await this.prisma.product.findMany({
      where: {
        OR: [
          { availableFrom: { lte: today } },
          { unavailableFrom: { lte: today } },
        ],
      },
    });
    for (const p of due) {
      // obie daty minęły – liczy się późniejsza (ostatnia zaplanowana decyzja; ten sam dzień zablokowany przy zapisie)
      const on =
        p.availableFrom && p.availableFrom <= today ? p.availableFrom : null;
      const off =
        p.unavailableFrom && p.unavailableFrom <= today
          ? p.unavailableFrom
          : null;
      const available = on && (!off || on > off);
      const changes: Prisma.ProductUpdateInput = available
        ? { isActive: true, ...(p.isSeasonal ? { inSeason: true } : {}) }
        : p.isSeasonal
          ? { inSeason: false }
          : { isActive: false };
      await this.prisma.product.update({
        where: { id: p.id },
        data: {
          ...changes,
          ...(on ? { availableFrom: null } : {}),
          ...(off ? { unavailableFrom: null } : {}),
        },
      });
      this.logger.log(
        `Zaplanowana zmiana: „${p.name}” – ${available ? 'dostępny' : 'niedostępny'}`,
      );
    }
  }

  // LABELS
  async findAllLabels() {
    const labels = await this.prisma.productLabel.findMany({
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { products: true } } },
    });
    return Promise.all(labels.map((l) => this.withPromoCount(l)));
  }

  async findLabel(id: string) {
    const label = await this.prisma.productLabel.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!label) throw new NotFoundException('Nie ma takiej etykiety');
    return this.withPromoCount(label);
  }

  /** Etykieta „Promocja” nie ma przypisań – liczba produktów to produkty z włączoną promocją */
  private async withPromoCount<
    T extends { system: string | null; _count: { products: number } },
  >(label: T): Promise<T> {
    if (label.system !== 'promo') return label;
    const products = await this.prisma.product.count({
      where: { isPromo: true },
    });
    return { ...label, _count: { products } };
  }

  /** Wygląd etykiety „Promocja” (nazwa, kolor, kolejność, adres filtra) – dołączany do produktów */
  private promoLabel() {
    return this.prisma.productLabel.findUnique({
      where: { system: 'promo' },
      select: { id: true, name: true, slug: true, color: true, order: true },
    });
  }

  /** Etykiety, które można przypisać ręcznie (bez stałych, np. „Promocja”) */
  private async assignableLabelIds(ids: string[]) {
    const labels = await this.prisma.productLabel.findMany({
      where: { id: { in: ids }, system: null },
      select: { id: true },
    });
    return labels.map((l) => ({ id: l.id }));
  }

  async createLabel(dto: CreateLabelDto) {
    await this.assertLabelNameFree(dto.name);
    this.assertLabelDates(dto.activeFrom, dto.activeTo);
    // adres filtra ustalany raz, przy dodaniu – zmiana nazwy nie psuje udostępnionych linków
    const base = slugify(dto.name);
    let slug = base;
    for (
      let i = 2;
      await this.prisma.productLabel.findUnique({ where: { slug } });
      i++
    )
      slug = `${base}-${i}`;
    const last = await this.prisma.productLabel.aggregate({
      _max: { order: true },
    });
    return this.prisma.productLabel.create({
      data: {
        name: dto.name,
        slug,
        color: dto.color ?? 'gold',
        order: dto.order ?? (last._max.order ?? 0) + 1,
        activeFrom: dto.activeFrom ?? null,
        activeTo: dto.activeTo ?? null,
      },
    });
  }

  async updateLabel(id: string, dto: UpdateLabelDto) {
    if (dto.name !== undefined) await this.assertLabelNameFree(dto.name, id);
    const current = await this.findLabel(id);
    const from =
      dto.activeFrom !== undefined ? dto.activeFrom : current.activeFrom;
    const to = dto.activeTo !== undefined ? dto.activeTo : current.activeTo;
    this.assertLabelDates(from, to);
    // etykieta stała (promocja) pokazuje się w czasie promocji – bez własnych dat
    const dates = current.system
      ? { activeFrom: null, activeTo: null }
      : { activeFrom: from, activeTo: to };
    return this.prisma.productLabel.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
        ...(dto.order !== undefined ? { order: dto.order } : {}),
        ...dates,
      },
    });
  }

  /** Usunięcie etykiety zdejmuje ją ze wszystkich produktów (same produkty zostają); stałych nie można usunąć */
  async deleteLabel(id: string) {
    const label = await this.findLabel(id);
    if (label.system)
      throw new BadRequestException(
        `Etykiety „${label.name}” nie można usunąć – strona nadaje ją sama. Możesz zmienić jej nazwę i kolor.`,
      );
    return this.prisma.productLabel.delete({ where: { id } });
  }

  private assertLabelDates(from?: string | null, to?: string | null) {
    if (from && to && from > to)
      throw new BadRequestException(
        'Koniec widoczności etykiety nie może być przed jej początkiem',
      );
  }

  /** Produkt dla strony i panelu: promocja (czy trwa, cena dziś), etykiety z informacją, czy są dziś widoczne */
  private present<
    T extends Parameters<typeof withPromo>[0] & {
      labels: { activeFrom: string | null; activeTo: string | null }[];
    },
  >(
    product: T,
    promoLabel: Awaited<ReturnType<ProductsService['promoLabel']>>,
  ) {
    const today = warsawNow().date;
    return {
      ...withPromo(product),
      labels: product.labels.map((l) => ({
        ...l,
        active: isLabelActive(l, today),
      })),
      promoLabel,
    };
  }

  /**
   * Historia promocji (do „Skuteczności promocji”): jeden otwarty okres na produkt – aktualizowany przy zmianach,
   * zamykany po wyłączeniu promocji; promocja zakończona datą i ustawiona na nowo – nowy okres.
   */
  private async syncPromoPeriod(p: {
    id: string;
    name: string;
    price: number;
    isPromo: boolean;
    promoPrice: number | null;
    promoFrom: string | null;
    promoTo: string | null;
  }) {
    const today = warsawNow().date;
    const open = await this.prisma.promoPeriod.findFirst({
      where: { productId: p.id, endedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    if (!p.isPromo) {
      if (open)
        await this.prisma.promoPeriod.update({
          where: { id: open.id },
          data: {
            endedAt: new Date(),
            to: open.to && open.to < today ? open.to : today,
          },
        });
      return;
    }
    const data = {
      productName: p.name,
      price: p.price,
      promoPrice: p.promoPrice,
      to: p.promoTo,
    };
    const finished = open?.to != null && open.to < today;
    if (
      open &&
      finished &&
      (p.promoTo !== open.to || p.promoFrom !== open.from)
    ) {
      await this.prisma.promoPeriod.update({
        where: { id: open.id },
        data: { endedAt: new Date() },
      });
    } else if (open) {
      await this.prisma.promoPeriod.update({
        where: { id: open.id },
        data: { ...data, from: p.promoFrom ?? open.from },
      });
      return;
    }
    await this.prisma.promoPeriod.create({
      data: { ...data, productId: p.id, from: p.promoFrom ?? today },
    });
  }

  private async assertLabelNameFree(name: string, exceptId?: string) {
    const same = await this.prisma.productLabel.findFirst({
      where: { name, ...(exceptId ? { NOT: { id: exceptId } } : {}) },
    });
    // „Teraz dostępne” i „Poza sezonem” nadaje strona produktom sezonowym
    const reserved = ['teraz dostępne', 'poza sezonem'];
    if (same || reserved.includes(name.toLowerCase()))
      throw new ConflictException(`Etykieta „${name}” już istnieje`);
  }

  /** Promocja: daty w dobrej kolejności, cena promocyjna niższa od zwykłej */
  private assertPromo(next: PromoInput) {
    if (next.promoFrom && next.promoTo && next.promoFrom > next.promoTo)
      throw new BadRequestException(
        'Promocja nie może kończyć się przed jej rozpoczęciem',
      );
    if (
      next.promoPrice != null &&
      next.price !== undefined &&
      next.promoPrice >= next.price
    )
      throw new BadRequestException(
        'Cena promocyjna musi być niższa od zwykłej ceny',
      );
  }

  // CATEGORY
  createCategory(dto: CreateCategoryDto): Prisma.PrismaPromise<Category> {
    return this.prisma.category.create({ data: dto });
  }

  getCategoryById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  findAllCategories(): Prisma.PrismaPromise<Category[]> {
    return this.prisma.category.findMany({ include: { products: true } });
  }

  updateCategory(
    id: string,
    dto: CreateCategoryDto,
  ): Prisma.PrismaPromise<Category> {
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async deleteCategory(id: string): Promise<Category> {
    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new BadRequestException(
        'Cannot delete category that still has products assigned.',
      );
    }

    return this.prisma.category.delete({ where: { id } });
  }

  // PRODUCT
  async findAllProducts() {
    const products = await this.prisma.product.findMany({
      // kolejność jak w panelu: kategorie, potem produkty wg dodania
      orderBy: [
        { category: { createdAt: 'asc' } },
        { createdAt: 'asc' },
        { name: 'asc' },
      ],
      include: PRODUCT_INCLUDE,
    });
    const promoLabel = await this.promoLabel();
    return products.map((p) => this.present(p, promoLabel));
  }

  async findProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: PRODUCT_INCLUDE,
    });
    return product && this.present(product, await this.promoLabel());
  }

  /** „Dostępny od” i „Niedostępny od” nie mogą wskazywać tego samego dnia (nie wiadomo, co ma wygrać) */
  private assertSchedule(from?: string | null, to?: string | null) {
    if (from && to && from === to)
      throw new BadRequestException(
        '„Dostępny od” i „Niedostępny od” nie mogą być tym samym dniem',
      );
  }

  async createProduct(dto: CreateProductDto) {
    this.assertSchedule(dto.availableFrom, dto.unavailableFrom);
    const { images, labelIds, availableFrom, unavailableFrom, ...productData } =
      dto as any;
    this.assertPromo(dto);

    const imagesData = (images || []).map(
      (img: { imgUrl: string; order: number }, index: number) => ({
        imgUrl: img.imgUrl,
        order: img.order ?? index,
      }),
    );

    const created = await this.prisma.product.create({
      data: {
        ...productData,
        isActive: dto.isActive,
        availableFrom: (availableFrom as string | null) ?? null,
        unavailableFrom: (unavailableFrom as string | null) ?? null,
        images: {
          create: imagesData,
        },
        labels: {
          connect: await this.assignableLabelIds((labelIds as string[]) ?? []),
        },
      },
      include: PRODUCT_INCLUDE,
    });
    await this.syncPromoPeriod(created);
    return this.present(created, await this.promoLabel());
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    // 1) pobierz stare zdjęcia
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!existing) throw new NotFoundException('Nie ma takiego produktu');

    const { images, ...rest } = dto as any;
    // promocję sprawdzamy na danych po zmianie (np. nowa cena zwykła przy starej promocyjnej)
    const pick = <K extends keyof PromoInput>(key: K) =>
      (rest[key] !== undefined ? rest[key] : existing[key]) as PromoInput[K];
    this.assertSchedule(
      rest.availableFrom !== undefined
        ? (rest.availableFrom as string | null)
        : existing.availableFrom,
      rest.unavailableFrom !== undefined
        ? (rest.unavailableFrom as string | null)
        : existing.unavailableFrom,
    );
    this.assertPromo({
      price: pick('price'),
      promoPrice: pick('promoPrice'),
      promoFrom: pick('promoFrom'),
      promoTo: pick('promoTo'),
    });

    const data: Prisma.ProductUpdateInput = {
      ...(rest.name !== undefined ? { name: rest.name } : {}),
      ...(rest.description !== undefined
        ? { description: rest.description }
        : {}),
      ...(rest.price !== undefined ? { price: rest.price } : {}),
      ...(rest.isSeasonal !== undefined ? { isSeasonal: rest.isSeasonal } : {}),
      ...(rest.inSeason !== undefined ? { inSeason: rest.inSeason } : {}),
      ...(Array.isArray(rest.labelIds)
        ? {
            labels: {
              set: await this.assignableLabelIds(rest.labelIds as string[]),
            },
          }
        : {}),
      ...(rest.availableFrom !== undefined
        ? {
            availableFrom: (rest.availableFrom as string | null) ?? null,
          }
        : {}),
      ...(rest.unavailableFrom !== undefined
        ? {
            unavailableFrom: (rest.unavailableFrom as string | null) ?? null,
          }
        : {}),
      ...(rest.isPromo !== undefined ? { isPromo: rest.isPromo } : {}),
      ...(rest.promoPrice !== undefined ? { promoPrice: rest.promoPrice } : {}),
      ...(rest.promoFrom !== undefined ? { promoFrom: rest.promoFrom } : {}),
      ...(rest.promoTo !== undefined ? { promoTo: rest.promoTo } : {}),
      ...(rest.isActive !== undefined ? { isActive: rest.isActive } : {}),
      ...(rest.isReservable !== undefined
        ? { isReservable: rest.isReservable }
        : {}),
      ...(rest.categoryId !== undefined ? { categoryId: rest.categoryId } : {}),
    };

    let urlsToDelete: string[] = [];

    if (Array.isArray(images)) {
      const newUrls = images
        .filter((img) => img && img.imgUrl)
        .map((img) => img.imgUrl as string);

      const oldUrls = existing?.images?.map((img) => img.imgUrl) ?? [];

      urlsToDelete = oldUrls.filter((url) => !newUrls.includes(url));

      const imagesData = newUrls.map((url, index) => ({
        imgUrl: url,
        order: index,
      }));

      data.images = {
        deleteMany: {},
        create: imagesData,
      };
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data,
      include: PRODUCT_INCLUDE,
    });

    if (urlsToDelete.length > 0) {
      await deleteImageFiles(urlsToDelete);
    }

    await this.syncPromoPeriod(updated);
    return this.present(updated, await this.promoLabel());
  }

  async deleteProduct(id: string): Promise<Product> {
    // pobierz produkt z obrazkami i kategorią
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, category: { include: { products: true } } },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const imgUrls = product.images.map((img) => img.imgUrl);

    // tranzakcja: usuń obrazki i produkt
    const deleted = await this.prisma.$transaction(async (tx) => {
      await tx.productImages.deleteMany({ where: { productId: id } });
      const deletedProduct = await tx.product.delete({ where: { id } });

      // jeśli kategoria nie ma już produktów – usuń kategorię
      if (product.categoryId) {
        const remaining = await tx.product.count({
          where: { categoryId: product.categoryId },
        });
        if (remaining === 0) {
          await tx.category.delete({ where: { id: product.categoryId } });
        }
      }

      return deletedProduct;
    });

    if (imgUrls.length > 0) {
      await deleteImageFiles(imgUrls);
    }

    return deleted;
  }
}
