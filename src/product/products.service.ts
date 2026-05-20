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
async createProduct(createProductDto: CreateProductDTO) {
    // 1. Kiểm tra xem danh mục (Category) có tồn tại thực sự không
    const categoryExists = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });
    
    if (!categoryExists) {
      throw new NotFoundException(`Danh mục với ID ${createProductDto.categoryId} không tồn tại.`);
    }

    // 2. Kiểm tra trùng mã SKU (Stock Keeping Unit) - Mã định danh duy nhất cho sản phẩm
    const skuExists = await this.prisma.product.findUnique({
      where: {sku: createProductDto.sku } as any,
    });

    if (skuExists) {
      throw new ConflictException(`Mã SKU "${createProductDto.sku}" đã được sử dụng cho sản phẩm khác.`);
    }

    // 3. Tạo sản phẩm mới trong Database kèm theo bản ghi Inventory (Kho hàng) mặc định
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        sku: createProductDto.sku,
        price: createProductDto.price,
        status: createProductDto.status || 'ACTIVE',
        categoryId: createProductDto.categoryId,
        // (Tùy chọn) Tự động tạo luôn bản ghi kho hàng bằng 0 cho sản phẩm này
        inventory: {
          create: {
            quantity: 0,
            reservedQuantity: 0
          }
        }
      },
      // Trả về kèm theo thông tin category và inventory để client tiện hiển thị
      include: {
        category: true,
        inventory: true,
      }
    });
  }
  async deleteProduct(id: number) {
    await this.findProduct(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }
  async updateProduct(id: number, updateProductDTO: UpdateProductDTO) {
    await this.findProduct(id);
      if (updateProductDTO.categoryId) {
        await this.findcategoryProducts(updateProductDTO.categoryId);
      }
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