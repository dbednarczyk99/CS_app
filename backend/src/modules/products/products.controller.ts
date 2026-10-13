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
import { Public, Roles, CONTENT_ROLES } from '../auth/auth.decorators';

@Roles(...CONTENT_ROLES)
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  // Categories
  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.service.createCategory(dto);
  }

  @Public()
  @Get('categories')
  getCategories() {
    return this.service.findAllCategories();
  }

  @Public()
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
  @Public()
  @Get()
  findAllProducts() {
    return this.service.findAllProducts();
  }

  @Public()
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
}
