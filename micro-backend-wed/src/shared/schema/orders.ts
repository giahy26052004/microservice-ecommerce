import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum paymentStatus {
  pending = 'pending',
  paid = 'paid',
  failed = 'failed',
}
export enum orderStatus {
  pending = 'pending',
  complete = 'complete',
}
export class OrderedItems {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  quantity: number;
  @Prop({ required: true })
  skuCode: string;
  @Prop({ required: true })
  price: number;
  @Prop({ required: true, default: false })
  lifetime: boolean;
  @Prop({ required: true })
  validity: number;
  @Prop({ required: true })
  skuPriceId: string;
  @Prop({ required: true })
  productName: string;
}
@Schema({ timestamps: true })
export class Orders {
  @Prop({ required: true })
  orderId: string;
  @Prop({ required: true, type: mongoose.Schema.ObjectId, ref: 'Users' })
  user: string;
  @Prop({ required: true })
  customerPhoneNumber: string;
  @Prop({ required: true, default: orderStatus.pending })
  orderStatus: orderStatus;
  @Prop({ default: false })
  isOrderDelivered: boolean;
  @Prop({ default: null })
  checkOutSessionId: string;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
