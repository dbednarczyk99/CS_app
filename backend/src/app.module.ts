import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UploadController } from './modules/upload/upload.controller';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { BreadVanModule } from './modules/bread-van/bread-van.module';
import { ContactInfoModule } from './modules/contact-info/contact-info.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    ProductsModule,
    AuthModule,
    BlogModule,
    BreadVanModule,
    ContactInfoModule,
  ],
  controllers: [UploadController],
})
export class AppModule {}
