import { IsNotEmpty, IsNumber, MinLength, MaxLength, Min, Max, IsString, Matches, IsOptional } from 'class-validator';
export class UpdateProductDTO {
    @IsOptional()
    @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
    @MinLength(3, { message: 'Tên sản phẩm phải có ít nhất 3 ký tự' })
    @MaxLength(50, { message: 'Tên sản phẩm tối đa 50 ký tự' })
    name?: string
    @IsOptional()
    @IsNumber({}, { message: 'Giá sản phẩm phải là số' })
    @Min(500000, { message: 'Giá phải lớn hơn hoặc bằng 500,000' })
    @Max(99999999, { message: 'Giá không được vượt quá 99,999,999' })
    @IsOptional()
    price?: number;
    @IsNumber({}, { message: 'ID danh mục phải là số' })
    @IsOptional()
    categoryId?: number;
}