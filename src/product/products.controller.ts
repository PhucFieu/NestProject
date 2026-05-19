import { Post, Body, Controller, Get, Delete, Param, Patch } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './create-products.dto';
import { UpdateProductDTO } from './update-products.dto';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }
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