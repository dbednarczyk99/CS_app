import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RevalidateInterceptor } from './revalidate.interceptor';

@Module({
  providers: [{ provide: APP_INTERCEPTOR, useClass: RevalidateInterceptor }],
})
export class RevalidateModule {}
