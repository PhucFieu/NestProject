import { Module } from '@nestjs/common';
import {ProductsModule } from './product/products.module';

@Module({
  imports: [ProductsModule],
})
export class AppModule {}
