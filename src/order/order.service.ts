import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) { }

  async findOne(id: number) {
    // Không dùng String(id), Prisma sẽ tự hiểu id là number
    const order = await this.prisma.order.findUnique({
      where: { id }, 
      include: { orderItems: true },
    });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID = ${id}`);
    }

    return order;
  }

  async createOrder(userId: number) {
    return this.prisma.$transaction(async (trans: any) => {
      const cart = await trans.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } }
      });

      if (!cart || cart.items.length === 0) {
        throw new NotFoundException('Giỏ hàng trống, không thể tạo đơn hàng');
      }

      let totalAmount = 0;
      const orderItemsData: any[] = [];

      for (const item of cart.items) {
        if (item.product.status !== 'ACTIVE') {
          throw new BadRequestException('Sản phẩm hiện tại không hoạt động');
        }

        const inventory = await trans.inventory.findUnique({
          where: { productId: item.productId }
        });

        if (!inventory) {
          throw new NotFoundException('Không tìm thấy thông tin kho của sản phẩm');
        }

        const availableStock = inventory.quantity - inventory.reservedQuantity;
        if (item.quantity > availableStock) {
          throw new BadRequestException('Số lượng trong kho không đủ để cung cấp');
        }

        totalAmount += item.product.price * item.quantity;

        orderItemsData.push({
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        });

        await trans.inventory.update({
          where: { productId: item.productId },
          data: { reservedQuantity: { increment: item.quantity } }
        });
      }

      const order = await trans.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PENDING',
          orderItems: { create: orderItemsData }
        },
        include: { orderItems: true }
      });

      await trans.cartItem.deleteMany({ where: { cartId: cart.id } });
      return order;
    });
  }

  async updateOrderStatus(orderId: number, newStatus: any) {
    // 1. Tìm đơn hàng
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true }
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    if (order.status === 'COMPLETED' && newStatus === 'PENDING') {
      throw new BadRequestException('Không được chuyển ngược trạng thái đơn hàng');
    }

    // 2. Transaction update
    return this.prisma.$transaction(async (trans: any) => {
      if (newStatus === 'CANCELLED' && order.status !== 'CANCELLED') {
        for (const item of order.orderItems) {
          await trans.inventory.update({
            where: { productId: item.productId },
            data: { reservedQuantity: { decrement: item.quantity } }
          });
        }
      }

      return trans.order.update({
        where: { id: orderId },
        data: { status: newStatus },
        include: { orderItems: true } // Trả về kèm orderItems để tránh lỗi thiếu data
      });
    });
  }
}