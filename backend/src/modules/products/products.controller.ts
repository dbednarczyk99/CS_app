import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateProductImagesOrderDto } from './dto/update-product-image.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  // Categories
  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.service.createCategory(dto);
  }

  @Get('categories')
  getCategories() {
    return this.service.findAllCategories();
  }

  @Get('categories/:id')
  getCategory(@Param('id') id: string) {
    return this.service.getCategoryById(id);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: CreateCategoryDto) {
    return this.service.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.service.deleteCategory(id);
  }

  // Products
  @Get()
  findAllProducts() {
    return this.service.findAllProducts();
  }

  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return this.service.findProduct(id);
  }

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.service.createProduct(dto);
  }

  @Patch(':id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.service.updateProduct(id, dto);
  }

  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    return this.service.deleteProduct(id);
  }

  @Patch(':id/images/order')
  updateImagesOrder(
    @Param('id') id: string,
    @Body() dto: UpdateProductImagesOrderDto,
  ) {
    return this.service.updateProductImagesOrder(id, dto);
  }
}
