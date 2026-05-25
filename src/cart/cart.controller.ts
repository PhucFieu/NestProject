
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ParseIntPipe, UnauthorizedException } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartDTO } from './dto/add-cart.dto';
import { UpdateCartItemDTO } from './dto/update-cart.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  async getCart(@Req() req: any) {
    const userId = req.user?.id || req.user?.userId || req.user?.sub;
    return await this.cartService.getCart(userId);
  }

  @Post('add')
  async addCart(@Req() req: any, @Body() addCartDTO: AddCartDTO) {
    const rawUserId = req.user?.id || req.user?.userId || req.user?.sub;

    if (!rawUserId) {
      throw new UnauthorizedException('Token hop le nhung khong tim thay ID nguoi dung ben trong!');
    }

    const userId = Number(rawUserId);
    return await this.cartService.addCart(userId, addCartDTO);
  }

  @Patch(':productId')
  async updateCartItem(
    @Req() req: any,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateCartItemDTO: UpdateCartItemDTO,
  ) {
    const userId = req.user?.id || req.user?.userId || req.user?.sub;;
    return await this.cartService.updateCartItem(userId, productId, updateCartItemDTO);
  }

  @Delete(':productId')
  async removeCartItem(
    @Req() req: any,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const userId = req.user?.id || req.user?.userId || req.user?.sub;;
    return await this.cartService.removeCartItem(userId, productId);
  }
}