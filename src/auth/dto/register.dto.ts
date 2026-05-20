import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsNumber, IsOptional } from 'class-validator';
export class RegisterDTO {
    @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên' })
  password!: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsNumber({}, { message: 'roleId phải là một số' })
  @IsNotEmpty({ message: 'roleId không được để trống' })
  roleId!: number;
}