import { Module } from '@nestjs/common';
import {ProductsModule } from './product/products.module'; 
import { PrismaService } from './prisma.service';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [ProductsModule, CategoryModule, AuthModule],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}

