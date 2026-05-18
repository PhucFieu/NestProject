import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from './create-products.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateProductDTO } from './update-products.dto';
import { PrismaService } from '../prisma.service';
@Injectable()
export class ProductsService {
constructor(private prisma: PrismaService) { }
  async products() {
    return this.prisma.product.findMany();
  }
async createProduct(createProductDTO: CreateProductDTO) {
  return this.prisma.product.create({
    data: {
      name: createProductDTO.name,
      price: createProductDTO.price,
    },
  });
}
  async deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
  async updateProduct(id: string, updateProductDTO: UpdateProductDTO) {
    await this.findProduct(id);
    return this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDTO.name,
        price: updateProductDTO.price,
      },
    });
  }
  async findProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
  
}
