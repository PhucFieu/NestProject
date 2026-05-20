import { IsNotEmpty, IsNumber, MinLength, MaxLength, Min, Max, IsString, Matches, IsOptional, IsBoolean } from 'class-validator';
export class CreateCategoryDTO {
   @IsString()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug không được để trống' })
  slug!: string; // Thường client truyền lên dạng "dien-thoai-apple" hoặc bạn tự sinh ở Service

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}