import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsEnum,

} from 'class-validator';
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
}
export class OrderedItemsDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  skuCode: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  lifetime: boolean;

  @IsNotEmpty()
  validity: number;

  @IsNotEmpty()
  @IsString()
  skuPriceId: string;

  @IsNotEmpty()
  @IsString()
  productName: string;
}
export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  user: string; // Nếu bạn cần lưu ID của người dùng

  @IsNotEmpty()
  cartItems: any;

  @IsNotEmpty()
  @IsPhoneNumber(null)
  customerPhoneNumber: string;

  @IsNotEmpty()
  @IsString()
  name: string; // Thêm tên người đặt hàng

  @IsNotEmpty()
  @IsString()
  email: string; // Thêm email người đặt hàng

  @IsNotEmpty()
  @IsString()
  city: string; // Thêm thành phố

  @IsNotEmpty()
  @IsString()
  streetAddress: string; // Thêm địa chỉ

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
}
