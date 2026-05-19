import { Post, Body, Controller, Get, Delete, Param, Patch } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './create-category.dto';
import { UpdateCategoryDTO } from './update-category.dto';
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }
    @Get()
      categories() {
        return this.categoryService.categories();
      }
      @Get(':id')
      getcategory(@Param('id') id: number) {
        return this.categoryService.findCategory((id));
      }
      @Post()
      createcategory(@Body() body: CreateCategoryDTO) {
        return this.categoryService.createCategory(body);
      }
      @Delete(':id')
      deletecategory(@Param('id') id: number) {
        return this.categoryService.deleteCategory((id));
      }
      @Patch(':id')
      updatecategory
        (@Param('id') id: number, @Body() body: UpdateCategoryDTO) {
        return this.categoryService.updateCategory((id), body);
      }
}
