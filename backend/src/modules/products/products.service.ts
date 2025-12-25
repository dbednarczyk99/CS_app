import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Category, Product, ProductImages } from '@prisma/client';
import * as fs from 'fs/promises';
import { URL } from 'url';
import { join } from 'path';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // helper – wyciągnięcie nazwy pliku z imgUrl
  private extractFilenameFromUrl(imgUrl: string): string | null {
    try {
      const url = new URL(imgUrl);
      const pathname = url.pathname; // np. /uploads/abc.jpg
      const parts = pathname.split('/');
      return parts[parts.length - 1] || null;
    } catch {
      return null;
    }
  }

  private async deleteImageFiles(imgUrls: string[]): Promise<void> {
    await Promise.all(
      imgUrls.map(async (url) => {
        const filename = this.extractFilenameFromUrl(url);
        if (!filename) return;
        const fullPath = join(process.cwd(), 'uploads', filename);
        try {
          await fs.unlink(fullPath);
        } catch {
          // ignorujemy, jeśli pliku już nie ma
        }
      }),
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

    const imagesData = (images || []).map((img: { imgUrl: string }) => ({
      imgUrl: img.imgUrl,
    }));

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
      const newUrls = images
        .filter((img) => img && img.imgUrl)
        .map((img) => img.imgUrl as string);

      const oldUrls = existing?.images?.map((img) => img.imgUrl) ?? [];

      // URL-e, których już nie ma w nowej liście – pliki do skasowania
      urlsToDelete = oldUrls.filter((url) => !newUrls.includes(url));

      const imagesData = newUrls.map((url) => ({ imgUrl: url }));

      data.images = {
        deleteMany: {},
        create: imagesData,
      };
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data,
      include: { images: true, category: true },
    });

    if (urlsToDelete.length > 0) {
      await this.deleteImageFiles(urlsToDelete);
    }

    return updated;
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
      await this.deleteImageFiles(imgUrls);
    }

    return deleted;
  }

  // PRODUCT IMAGE – zostawiam, jeśli chcesz używać osobno
  addImage(dto: CreateProductImageDto): Prisma.PrismaPromise<ProductImages> {
    return this.prisma.productImages.create({ data: dto });
  }

  removeImage(id: string): Prisma.PrismaPromise<ProductImages> {
    return this.prisma.productImages.delete({ where: { id } });
  }
}
