import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum categoryType {
  operatingSystem = 'Operating System',
  applicationSoftware = 'Application Software',
}

export enum platformType {
  windows = 'Windows',
  mac = 'Mac',
  linux = 'Linux',
  android = 'Android',
  ios = 'iOS',
}

export enum baseType {
  computer = 'Computer',
  mobile = 'Mobile',
}
//feedbackDetails
@Schema({ timestamps: true })
export class Feadbackers extends mongoose.Document {
  @Prop({})
  customerId: string;
  @Prop({})
  customerName: string;
  @Prop({})
  rating: number;
  @Prop({})
  feedbackMsg: string;
}
export const feedbackSchema = SchemaFactory.createForClass(Feadbackers);

//skuDetails
@Schema({ timestamps: true })
export class SkuDetails extends mongoose.Document {
  @Prop({})
  skuName: string;
  @Prop({})
  price: number;
  @Prop({})
  validity: number;
  @Prop({})
  lifetime: string;
  @Prop({})
  skuCode: string;
}
export const skuDetailsSchema = SchemaFactory.createForClass(SkuDetails);
//PRODUCTS SCHEMA
@Schema({ timestamps: true })
export class Products {
  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    default:
      'https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101027/112815900-no-image-available-icon-flat-vector.jpg?ver=6',
  })
  image?: string;
  @Prop({
    required: true,
    enum: [categoryType.applicationSoftware, categoryType.operatingSystem],
  })
  category: string;

  @Prop({
    required: true,
    enum: [
      platformType.android,
      platformType.ios,
      platformType.linux,
      platformType.mac,
      platformType.windows,
    ],
  })
  platformType: string;

  @Prop({ required: true, enum: [baseType.mobile, baseType.computer] })
  baseType: string;
  @Prop({ required: true })
  productUrl: string;
  @Prop({ required: true })
  downloadUrl: string;
  @Prop({ default: 0 })
  avgRating: number;
  @Prop([{ type: feedbackSchema }])
  feedbackDetails: Feadbackers[];
  @Prop([{ type: skuDetailsSchema }])
  skuDetails: SkuDetails[];
  @Prop({})
  productDetails: string;
  @Prop({ type: Object })
  imageDetails: Record<string, any>;

  @Prop({})
  requirementSpecification: Record<string, any>[];
  @Prop({})
  highlights: string[];
}
export const ProductsSchema = SchemaFactory.createForClass(Products);
