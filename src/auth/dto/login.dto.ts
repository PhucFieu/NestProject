import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
export class LoginDTO {
   @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password!: string;
}