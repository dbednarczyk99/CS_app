import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Category, Product } from '@prisma/client';
import deleteImageFiles from './../../scripts/imageHandler';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateProductImagesOrderDto } from './dto/update-product-image.dto';
//import { CreateProductImageDto } from './dto/create-product-image.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

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
  findAllProducts(): Prisma.PrismaPromise<Product[]> {
    return this.prisma.product.findMany({
      include: { images: true, category: true },
    });
  }

  findProduct(id: string): Prisma.PrismaPromise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true },
    });
  }

  createProduct(dto: CreateProductDto): Prisma.PrismaPromise<Product> {
    const { images, ...productData } = dto as any;

    const imagesData = (images || []).map(
      (img: { imgUrl: string; order: number }, index: number) => ({
        imgUrl: img.imgUrl,
        order: img.order ?? index,
      }),
    );

    return this.prisma.product.create({
      data: {
        ...productData,
        isActive: dto.isActive,
        images: {
          create: imagesData,
        },
      },
      include: { images: true, category: true },
    });
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
    // 1) pobierz stare zdjęcia
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    const { images, ...rest } = dto as any;

    const data: Prisma.ProductUpdateInput = {
      ...(rest.name !== undefined ? { name: rest.name } : {}),
      ...(rest.description !== undefined
        ? { description: rest.description }
        : {}),
      ...(rest.price !== undefined ? { price: rest.price } : {}),
      ...(rest.isSeasonal !== undefined ? { isSeasonal: rest.isSeasonal } : {}),
      ...(rest.isActive !== undefined ? { isActive: rest.isActive } : {}),
      ...(rest.categoryId !== undefined ? { categoryId: rest.categoryId } : {}),
    };

    let urlsToDelete: string[] = [];

    if (Array.isArray(images)) {
      const incoming = images.map(
        (img: { id?: string; imgUrl: string; order: number }) => img,
      );

      const existingImages = existing?.images ?? [];

      const incomingUrls = incoming.map((i) => i.imgUrl);
      const existingUrls = existingImages.map((i) => i.imgUrl);

      // 🗑 do usunięcia
      const toDelete = existingImages.filter(
        (img) => !incomingUrls.includes(img.imgUrl),
      );

      // ➕ nowe
      const toCreate = incoming.filter(
        (img) => !existingUrls.includes(img.imgUrl),
      );

      // 🔁 do aktualizacji (order)
      const toUpdate = incoming.filter((img) =>
        existingUrls.includes(img.imgUrl),
      );

      const baseOrder = existingImages.length;

      data.images = {
        deleteMany: {
          imgUrl: { in: toDelete.map((i) => i.imgUrl) },
        },
        create: toCreate.map((img, idx) => ({
          imgUrl: img.imgUrl,
          order: img.order ?? baseOrder + idx,
        })),
        updateMany: toUpdate.map((img) => ({
          where: { imgUrl: img.imgUrl },
          data: {
            order:
              img.order ??
              existingImages.find((e) => e.imgUrl === img.imgUrl)?.order ??
              0,
          },
        })),
      };

      urlsToDelete = toDelete.map((i) => i.imgUrl);
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data,
      include: { images: true, category: true },
    });

    if (urlsToDelete.length > 0) {
      await deleteImageFiles(urlsToDelete);
    }

    return updated;
  }

  async updateProductImagesOrder(
    productId: string,
    dto: UpdateProductImagesOrderDto,
  ) {
    await this.prisma.$transaction(
      dto.images.map((img) =>
        this.prisma.productImages.update({
          where: { id: img.id },
          data: { order: img.order },
        }),
      ),
    );

    return { success: true };
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
