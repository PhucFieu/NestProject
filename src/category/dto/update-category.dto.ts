import { IsNotEmpty, IsNumber, MinLength, MaxLength, Min, Max, IsString, Matches, IsOptional, IsBoolean } from 'class-validator';
export class UpdateCategoryDTO {
    @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}