import { IsNotEmpty, IsInt, Min } from 'class-validator';
export class UpdateCartItemDTO {
  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'Số lượng ít nhất phải bằng 1' })
  quantity!: number;
}