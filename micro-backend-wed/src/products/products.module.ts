import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductsSchema } from 'src/shared/schema/products';
import { Users, UserSchema } from 'src/shared/schema/users';
import { AuthMiddleware } from 'src/shared/middleware/auth';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/shared/middleware/role.guard';
import { License, LicenseSchema } from 'src/shared/schema/license';
import { OrderRepository } from 'src/shared/repositories/order.repository';

import { Orders, OrdersSchema } from 'src/shared/schema/orders';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Orders.name, schema: OrdersSchema }]),
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductsSchema },
    ]),
    MongooseModule.forFeature([{ name: License.name, schema: LicenseSchema }]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository,
    UserRepository,
    OrderRepository,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ProductsController);
  }
}
