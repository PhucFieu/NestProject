import { IsNotEmpty, IsNumber, MinLength, MaxLength, Min, Max, IsString, Matches, IsOptional, IsBoolean, IsIn } from 'class-validator';
export class CreateProductDTO {
   @IsString()
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Mã SKU không được để trống' })
  sku!: string; // Mã định danh sản phẩm (Ví dụ: IP15-PRO-128)

  @IsNumber({}, { message: 'Giá sản phẩm phải là số' })
  @Min(0, { message: 'Giá sản phẩm không được nhỏ hơn 0' })
  price!: number;

  @IsString()
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'], { message: 'Trạng thái phải là ACTIVE hoặc INACTIVE' })
  status?: string;

  @IsNumber({}, { message: 'categoryId phải là một số' })
  @IsNotEmpty({ message: 'categoryId không được để trống' })
  categoryId!: number;
}