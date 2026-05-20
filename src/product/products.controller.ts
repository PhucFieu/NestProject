import { Post, Body, Controller, Get, Delete, Param, Patch } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './dto/create-products.dto';
import { UpdateProductDTO } from './dto/update-products.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
  createproduct(@Body() body: CreateProductDTO) {
    return this.productsService.createProduct(body);
  }
  @Delete(':id')
  deleteproduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(parseInt(id));
  }
  @Patch(':id')
  updateproduct
    (@Param('id') id: string, @Body() body: UpdateProductDTO) {
    return this.productsService.updateProduct(parseInt(id), body);
  }
}