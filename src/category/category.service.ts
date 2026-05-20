import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';
@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
   async categories() {
      return this.prisma.category.findMany(
        {
          include: {
            products: {
              select: {
                name: true,
                price: true,
             }
           }
          },
        }
      );
    }
  async createCategory(createCategoryDTO: CreateCategoryDTO) {
    const slug = createCategoryDTO.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Khử dấu tiếng Việt
    .replace(/[^\w\s-]/g, '')       // Xóa ký tự đặc biệt
    .replace(/[\s_]+/g, '-')        // Thay khoảng trắng bằng dấu -
    .trim();
    return this.prisma.category.create({
      data: {
       name: createCategoryDTO.name,
      slug: createCategoryDTO.slug || slug,
      },
    });
  }
    async deleteCategory(id: number) {
      await this.findCategory(id);
      return this.prisma.category.delete({
        where: { id },
      });
    }
    async updateCategory(id: number, updateCategoryDTO: UpdateCategoryDTO) {
      await this.findCategory(id);
      return this.prisma.category.update({
        where: { id },
        data: {
          name: updateCategoryDTO.name,
        },
      });
    }
    async findCategory(id: number) {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return category;
    }
}
