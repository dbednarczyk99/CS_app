import {
  Injectable,
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
import { withPromo } from './promo';

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
  constructor(private prisma: PrismaService) {}

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
      },
    });
  }

  async updateLabel(id: string, dto: UpdateLabelDto) {
    if (dto.name !== undefined) await this.assertLabelNameFree(dto.name, id);
    return this.prisma.productLabel.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
        ...(dto.order !== undefined ? { order: dto.order } : {}),
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
    return products.map((p) => ({ ...withPromo(p), promoLabel }));
  }

  async findProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: PRODUCT_INCLUDE,
    });
    return (
      product && { ...withPromo(product), promoLabel: await this.promoLabel() }
    );
  }

  async createProduct(dto: CreateProductDto) {
    const { images, labelIds, ...productData } = dto as any;
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
        images: {
          create: imagesData,
        },
        labels: {
          connect: await this.assignableLabelIds((labelIds as string[]) ?? []),
        },
      },
      include: PRODUCT_INCLUDE,
    });
    return { ...withPromo(created), promoLabel: await this.promoLabel() };
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

    return { ...withPromo(updated), promoLabel: await this.promoLabel() };
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
