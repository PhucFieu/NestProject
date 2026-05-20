import { IsNotEmpty, IsNumber, MinLength, MaxLength, Min, Max, IsString, Matches, IsOptional, IsIn } from 'class-validator';
export class UpdateProductDTO {
    @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}