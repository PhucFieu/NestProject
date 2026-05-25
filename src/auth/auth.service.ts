import { PrismaService } from "../prisma.service";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO } from "./dto/register.dto";
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }
    async register(registerDTO: RegisterDTO) {
        const userExists = await this.prisma.user.findUnique({
            where: { email: registerDTO.email },
        });
        if (userExists) {
            throw new BadRequestException('User already exists');
        }
        const hash = 10;
        const hashesPassword = await bcrypt.hash(registerDTO.password, hash);
        const user = await this.prisma.user.create({
            data: {
                email: registerDTO.email,
                passwordHash: hashesPassword,
                fullName: registerDTO.fullName,
                roleId: registerDTO.roleId,
                status: 'ACTIVE',
            },
        });
        delete (user as any).passwordHash;
        return {
            message: 'User registered successfully', user
        };
    }
    async login(loginDTO: LoginDTO) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDTO.email },
            include: {
                role: true,
            },
        });
        if (!user) {
            throw new BadRequestException('Lỗi: Không tìm thấy Email này trong DB');
        }
        const isMatchPassword = await bcrypt.compare(loginDTO.password, user.passwordHash);
        if (!isMatchPassword) {
            throw new BadRequestException('Lỗi: Tìm thấy Email rồi nhưng Sai Mật Khẩu');
        }
        const payload = { email: user.email, sub: user.id, role: user.role.name };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const hashtoken = 10;
        const hashToken = await bcrypt.hash(refreshToken, hashtoken);
        await this.prisma.user.update({
            where: { email: loginDTO.email },
            data: { refreshToken: hashToken },
        });
        delete (user as any).passwordHash;
        delete (user as any).refreshToken;
        return { message: 'Login successful', user, accessToken, refreshToken };
    }
}
