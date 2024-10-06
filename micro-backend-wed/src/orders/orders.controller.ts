import { Controller, Get, Post, Body, Param, Query, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';

import { checkoutDtoArr } from './dto/checkout.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { Roles } from 'src/shared/middleware/role.decorator';
import { UserType } from 'src/shared/schema/users';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Query('status') status: string, @Req() req: any) {
    return await this.ordersService.findAll(status, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }
  @Post('/checkout')
  async checkout(@Body() body: checkoutDtoArr) {
    return await this.ordersService.checkout(body);
  }
  @Post()
  @Roles(UserType.CUSTOMER)
  async createOrder(@Body() order: CreateOrderDto, @Req() req: Request) {
    return await this.ordersService.createOrder(order, req);
  }
}
