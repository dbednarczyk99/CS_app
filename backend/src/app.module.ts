import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { BreadVanModule } from './modules/bread-van/bread-van.module';
import { ContactInfoModule } from './modules/contact-info/contact-info.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProductsModule,
    AuthModule,
    BlogModule,
    BreadVanModule,
    ContactInfoModule,
  ],
})
export class AppModule {}
