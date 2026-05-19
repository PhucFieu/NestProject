import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDTO } from './create-category.dto';
import { UpdateCategoryDTO } from './update-category.dto';
@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
   async categories() {
      return this.prisma.category.findMany();
    }
  async createCategory(createCategoryDTO: CreateCategoryDTO) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDTO.name,
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
