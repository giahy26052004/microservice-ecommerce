import { Inject, Injectable } from '@nestjs/common';
import { checkoutDtoArr } from './dto/checkout.dto';
import { OrderRepository } from 'src/shared/repositories/order.repository';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { UserType } from 'src/shared/schema/users';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(OrderRepository) private readonly orderDB: OrderRepository,
    @Inject(ProductRepository) private readonly productDB: ProductRepository,
    @Inject(UserRepository) private readonly userDB: UserRepository,
  ) {}

  async checkout(body: checkoutDtoArr) {
    try {
      const listItems = [];
      const cartItems = body.checkoutDetails;
      for (const item of cartItems) {
        const itemAreInStock = await this.productDB.findLicense({
          productSku: item.skuId,
          isSold: false,
        });
        if (!itemAreInStock) {
          throw new Error('Item not in stock');
        }
        if (itemAreInStock.length < item.quantity) {
          throw new Error('Not enough items in stock');
        } else {
          listItems.push({
            price: item.skuPriceId,
            quantity: item.quantity,
            adjustable_quantity: {
              enabled: true,
              maximum: 5,
              minimum: 1,
            },
          });
        }
      }
      if (listItems.length === 0) {
        throw new Error('No items in cart');
      }

      return {
        success: true,
        message: 'checkout completed',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(status: string, user: Record<string, any>) {
    try {
      const userDetails = await this.userDB.findOne({
        _id: user._id.toString(),
      });
      const query = {} as Record<string, any>;
      if (userDetails.type === UserType.CUSTOMER) {
        query.userId = user._id.toString();
      }
      if (status) {
        query.status = status;
      }
      const orders = await this.orderDB.find(query);
      return {
        success: true,
        message: 'Orders fetched successfully',
        result: orders,
      };
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }
  async getLicense(item: any) {
    try {
      const product = await this.productDB.findOne({ _id: item.productId });
      if (!product) throw new Error('Product not found');
      const skuDetails = await product.skuDetails.find(
        (sku: { skuCode: string }) => sku.skuCode === item.skuCode,
      );

      const license = await this.productDB.findLicense(
        {
          productSku: skuDetails._id,
          isSold: false,
        },
        item.quantity,
      );
      const licenseIds = license.map((license) => license._id);
      await this.productDB.updateManyLicense(
        {
          _id: { $in: licenseIds },
        },
        { isSold: true },
      );
      return license.map((license) => license.licenseKey);
    } catch (error) {
      throw error;
    }
  }
  async createOrder(data: CreateOrderDto, req: any) {
    try {
      data.user = req.user._id; // Gán ID người dùng từ req
      const orderCreate = await this.orderDB.create(data);

      // Có thể thực hiện các xử lý khác ở đây (như cập nhật kho, gửi email, v.v.)

      return {
        success: true,
        message: 'Order created successfully',
        result: orderCreate,
      };
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
