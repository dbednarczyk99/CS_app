import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { DebugController } from './debug.controller';
import { UploadController } from './modules/upload/upload.controller';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { BreadVanModule } from './modules/bread-van/bread-van.module';
import { ContactInfoModule } from './modules/contact/contact-info/contact-info.module';
import { LocationsModule } from './modules/contact/locations/locations.module';

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
    LocationsModule,
  ],
  controllers: [UploadController, DebugController],
})
export class AppModule {}
