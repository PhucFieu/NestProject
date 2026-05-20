import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO } from "./dto/register.dto";
import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('register')
    async register(@Body() registerDTO: RegisterDTO) {
        return this.authService.register(registerDTO);
    }
    @Post('login')
    async login(@Body() loginDTO: LoginDTO) {
        return this.authService.login(loginDTO);
    }
}