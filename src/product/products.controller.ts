import { Post, Body, Controller, Get, Delete, Param, Patch, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './dto/create-products.dto';
import { UpdateProductDTO } from './dto/update-products.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Request } from 'express';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }
  @UseGuards(JwtAuthGuard)
  @Get()
  products() {
    return this.productsService.products();
  }
  @Get(':id')
  getproduct(@Param('id') id: string) {
    return this.productsService.findProduct(parseInt(id));
  }
  @Post()
  createproduct(@Body() body: CreateProductDTO, @Req() req: Request) {
    return this.productsService.createProduct(body, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteproduct(@Param('id') id: string, @Req() req: Request) {
    return this.productsService.deleteProduct(parseInt(id), req.user);
  }
  @Patch(':id')
  updateproduct
    (@Param('id') id: string, @Body() body: UpdateProductDTO, @Req() req: Request) {
    return this.productsService.updateProduct(parseInt(id), body, req.user);
  }
}