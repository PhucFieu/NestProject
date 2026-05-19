import { IsNotEmpty, IsNumber, MinLength, MaxLength, Min, Max, IsString, Matches } from 'class-validator';
export class CreateCategoryDTO {
    @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
    @IsString({ message: 'Tên danh mục phải là chuỗi ký tự' })
    @MinLength(3, { message: 'Tên danh mục phải có ít nhất 3 ký tự' })
    @MaxLength(50, { message: 'Tên danh mục tối đa 50 ký tự' })
    @Matches(/^[a-zA-ZÀ-ỹ\s]+$/, { message: 'Tên không được chỉ chứa số' })
    name!: string
}