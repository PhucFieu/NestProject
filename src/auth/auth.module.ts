import { Module } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import {JwtModule} from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
@Module({
imports: [JwtModule.register({
  secret: 'mysecretkey',
  signOptions: { expiresIn: '10m' },
})],

  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy],
})
export class AuthModule {}