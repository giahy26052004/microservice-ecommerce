import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Orders } from '../schema/orders';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Orders.name) private readonly orderModel: Model<Orders>,
  ) {}
  async find(query: any) {
    const order = await this.orderModel.find(query);
    return order;
  }
  async findOne(query: any) {
    const order = await this.orderModel.findOne(query);
    return order;
  }
  async create(order: CreateOrderDto) {
    try {
      const createOrder = await this.orderModel.create(order);
      return createOrder;
    } catch (error) {
      throw error;
    }
  }
}
