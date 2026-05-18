import { Module } from '@nestjs/common';
import {ProductsModule } from './product/products.module'; 
import { PrismaService } from './prisma.service';

@Module({
  imports: [ProductsModule],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
