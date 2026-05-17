import { Post, Body, Controller, Get, Delete, Param, Patch } from '@nestjs/common';
import { CreateProductDTO } from './create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }
  @Get()
  products() {
    return this.productsService.products();
  }
  @Get(':id')
  getproduct (@Param('id') id: string) {
    return this.productsService.findproduct(Number(id));
  }
  @Post()
  createproduct(@Body() body: CreateProductDTO) {
    return this.productsService.createproduct(body);
  }
  @Delete(':id')
  deleteproduct(@Param('id') id: string) {
    return this.productsService.deleteproduct(Number(id));
  }
  @Patch(':id')
  updateproduct
  (@Param('id')id :string, @Body() body: CreateProductDTO) {
    return this.productsService.updateproduct(Number(id), body);
}
}