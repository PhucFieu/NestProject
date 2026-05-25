import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddCartDTO } from './dto/add-cart.dto';
import { UpdateCartItemDTO } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) { }

  private async findCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }
    return cart;
  }

  async getCart(userId: number) {
    const cart = await this.findCart(userId);

    const cartData = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cartData || !cartData.items || cartData.items.length === 0) {
      return {
        message: 'Giỏ hàng trống'
      };
    }

    const Items = cartData.items.map(item => {
      return {
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      };
    });

    return {
      message: 'Giỏ hàng của bạn',
      items: Items
    };
  }

  async addCart(userId: number, addCartDTO: AddCartDTO) {
    const cart = await this.findCart(userId);

    const ProductId = Number(addCartDTO.productId);
    const Quantity = Number(addCartDTO.quantity);

    const product = await this.prisma.product.findUnique({
      where: { id: ProductId },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: ProductId,
        },
      },
    });

    let updatedQuantity = Quantity;

    if (existingItem) {
      updatedQuantity = existingItem.quantity + Quantity;
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: updatedQuantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: ProductId,
          quantity: Quantity,
        },
      });
    }

    return {
      message: 'Sản phẩm đã được thêm vào giỏ hàng',
      data: {
        productName: product.name,
        price: product.price,
        quantity: updatedQuantity
      }
    };
  }

  async updateCartItem(userId: number, productId: number, updateCartItemDTO: UpdateCartItemDTO) {
    const cart = await this.findCart(userId);

    const item = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: Number(productId),
        },
      },
      include: {
        product: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Sản phẩm trong giỏ hàng không tồn tại');
    }

    const oldQuantity = item.quantity;
    const newQuantity = Number(updateCartItemDTO.quantity);

    await this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: newQuantity },
    });

    return {
      message: 'Số lượng sản phẩm đã được cập nhật',
      data: {
        productName: item.product.name,
        price: item.product.price,
        oldQuantity: oldQuantity,
        newQuantity: newQuantity
      }
    };
  }

  async removeCartItem(userId: number, productId: number) {
    const cart = await this.findCart(userId);
    const item = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Sản phẩm trong giỏ hàng không tồn tại');
    }
    await this.prisma.cartItem.delete({
      where:{
             id: item.id
            },
    });
    return { message: 'Sản phẩm đã được xóa khỏi giỏ hàng' };
  }
}