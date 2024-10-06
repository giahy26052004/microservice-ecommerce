import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export enum UserType {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}
@Schema({
  timestamps: true,
})
export class Users extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  type: string;
  @Prop({ default: false })
  isVerified: boolean;
  @Prop({ default: null })
  otp: number;
  @Prop({ default: null })
  otpExpiryTime: Date;
}
export const UserSchema = SchemaFactory.createForClass(Users);
