import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from './create-products.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateProductDTO } from './update-products.dto';
import { PrismaService } from '../prisma.service';
@Injectable()
export class ProductsService {
constructor(private prisma: PrismaService) { }
  async products() {
    const products = await this.prisma.product.findMany({
  include: {
    category: true,
  },
});
return products.map(product => ({
  id: product.id,
  name: product.name,
  price: product.price,
  category: product.category.name,
}));
  }
async createProduct(createProductDTO: CreateProductDTO) {
  return this.prisma.product.create({
    data: {
      name: createProductDTO.name,
      price: createProductDTO.price,
      categoryId: createProductDTO.categoryId,
    },
  });
}
  async deleteProduct(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
  async updateProduct(id: number, updateProductDTO: UpdateProductDTO) {
    await this.findProduct(id);
    return this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDTO.name,
        price: updateProductDTO.price,
        categoryId: updateProductDTO.categoryId,
      },
    });
  }
  async findProduct(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
  
}
