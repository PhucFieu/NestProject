import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-products.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateProductDTO } from './dto/update-products.dto';
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
  async createProduct(createProductDto: CreateProductDTO, user: any) {
    const categoryExists = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!categoryExists) {
      throw new NotFoundException(`Danh mục với ID ${createProductDto.categoryId} không tồn tại.`);
    }

    const skuExists = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku } as any,
    });

    if (skuExists) {
      throw new ConflictException(`Mã SKU "${createProductDto.sku}" đã được sử dụng cho sản phẩm khác.`);
    }

    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        sku: createProductDto.sku,
        price: createProductDto.price,
        status: createProductDto.status || 'ACTIVE',
        categoryId: createProductDto.categoryId,
        inventory: {
          create: {
            quantity: 0,
            reservedQuantity: 0
          }
        }
      },
      include: {
        category: true,
        inventory: true,
      }
    });
    await this.prisma.auditLog.create({
      data: {
        actorId: user.sub,
        action: 'CREATE_PRODUCT',
        entityType: 'Product',
        entityId: product.id,
        metadata: {
          productName: product.name,
          sku: product.sku,
        },
      },
    });
    return product;
  }
  async deleteProduct(id: number, user: any) {
    await this.findProduct(id);
    const product = await this.prisma.product.delete({
      where: { id },
    });
    await this.prisma.auditLog.create({
      data: {
        actorId: user.sub,
        action: 'DELETE_PRODUCT',
        entityType: 'Product',
        entityId: product.id,
      },
    });
    return product;
  }
  async updateProduct(id: number, updateProductDTO: UpdateProductDTO, user: any) {
    await this.findProduct(id);
    if (updateProductDTO.categoryId) {
      await this.findcategoryProducts(updateProductDTO.categoryId);
    }
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDTO.name,
        price: updateProductDTO.price,
        categoryId: updateProductDTO.categoryId,
      },
    });
    await this.prisma.auditLog.create({
      data: {
        actorId: user.sub,
        action: 'UPDATE_PRODUCT',
        entityType: 'Product',
        entityId: product.id,
      },
    });
    return product;
  }

  async findProduct(id: number) {
    const product = await this.prisma.product.findUnique({
      include: {
        category: true,
      },
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category.name,
    };
  }
  async findcategoryProducts(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    return this.prisma.product.findMany({
      where: { categoryId },
    });
  }
}