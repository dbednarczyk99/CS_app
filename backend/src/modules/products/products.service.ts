import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Category, Product, ProductImages } from '@prisma/client';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // CATEGORY
  createCategory(dto: CreateCategoryDto): Prisma.PrismaPromise<Category> {
    return this.prisma.category.create({ data: dto });
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

  deleteCategory(id: string): Prisma.PrismaPromise<Category> {
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
    return this.prisma.product.create({ data: dto });
  }

  updateProduct(
    id: string,
    dto: UpdateProductDto,
  ): Prisma.PrismaPromise<Product> {
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  deleteProduct(id: string): Prisma.PrismaPromise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }

  // PRODUCT IMAGE
  addImage(dto: CreateProductImageDto): Prisma.PrismaPromise<ProductImages> {
    return this.prisma.productImages.create({ data: dto });
  }

  removeImage(id: string): Prisma.PrismaPromise<ProductImages> {
    return this.prisma.productImages.delete({ where: { id } });
  }
}
