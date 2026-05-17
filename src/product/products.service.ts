import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from './create-product.dto';
@Injectable()
export class ProductsService {

  productlist: CreateProductDTO[] = [];
  products() {
    return this.productlist;
  }
  createproduct(product: CreateProductDTO) {
    this.productlist.push(product);
    return this.productlist;
  }
  deleteproduct(id: number) {
    this.productlist = this.productlist.filter((product: CreateProductDTO) => product.id !== id);
  }
  updateproduct(id: number, body: CreateProductDTO) {
    this.productlist = this.productlist.map((product: CreateProductDTO) => 
    {
      if (product.id === id) {
        return body;
      }
      return product;
    });
    return this.productlist;}
  findproduct(id: number) {
    return this.productlist.find((product : CreateProductDTO) => product.id === id);
  }
}
