import { IsNotEmpty, IsNumber, MinLength, MaxLength, Min, Max, IsString, Matches } from 'class-validator';

export class CreateProductDTO {
    @IsNotEmpty({ message: 'ID không được để trống' })
    id!: number;
    
    @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
    @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
    @MinLength(3, { message: 'Tên sản phẩm phải có ít nhất 3 ký tự' })
    @MaxLength(50, { message: 'Tên sản phẩm tối đa 50 ký tự' })
    @Matches(/^[a-zA-ZÀ-ỹ\s]+$/, { message: 'Tên không được chỉ chứa số' })
    name!: string;

    @IsNotEmpty({ message: 'Giá không được để trống' })
    @IsNumber({}, { message: 'Giá sản phẩm phải là số' })
    @Min(1, { message: 'Giá phải lớn hơn hoặc bằng 1' })
    @Max(99999, { message: 'Giá không được vượt quá 99,999' })
    price!: number;
}