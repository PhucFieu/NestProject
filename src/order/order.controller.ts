import { Post, Body, Controller, Get, Delete, Param, Patch, Req, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }
    @Get(':id')
    async getOrder(@Param('id', ParseIntPipe) id: number) {
        return this.orderService.findOne(id);
    }
    @Post(':userId')
    async createOrder(@Param('userId', ParseIntPipe) userId: number) {
        return this.orderService.createOrder(userId);
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id', ParseIntPipe) orderId: number,
        @Body('status') newStatus: string,
    ) {
        return this.orderService.updateOrderStatus(orderId, newStatus);
    }
}