import { IsNotEmpty, IsNumber, MinLength, MaxLength, Min, Max, IsString, Matches } from 'class-validator';
export class CreateProductDTO {
    @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
    @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
    @MinLength(3, { message: 'Tên sản phẩm phải có ít nhất 3 ký tự' })
    @MaxLength(50, { message: 'Tên sản phẩm tối đa 50 ký tự' })
    name!: string
    @IsNotEmpty({ message: 'Giá sản phẩm không được để trống' })
    @IsNumber({}, { message: 'Giá sản phẩm phải là số' })
    @Min(500000, { message: 'Giá phải lớn hơn hoặc bằng 500,000' })
    @Max(99999999, { message: 'Giá không được vượt quá 99,999,999' })
    @IsNumber({}, { message: 'Giá sản phẩm phải là số' })
    price!: number;
    @IsNumber({}, { message: 'ID danh mục phải là số' })
    @IsNotEmpty({ message: 'ID danh mục không được để trống' })
    categoryId!: number;
}