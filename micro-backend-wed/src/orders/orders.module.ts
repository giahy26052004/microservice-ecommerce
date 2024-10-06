import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { OrderRepository } from 'src/shared/repositories/order.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/shared/middleware/role.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrdersSchema } from 'src/shared/schema/orders';
import { Products, ProductsSchema } from 'src/shared/schema/products';
import { Users, UserSchema } from 'src/shared/schema/users';
import { License, LicenseSchema } from 'src/shared/schema/license';
import { AuthMiddleware } from 'src/shared/middleware/auth';
import config from 'config';
@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    ProductRepository,
    OrderRepository,
    UserRepository,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [
    MongooseModule.forFeature([{ name: Orders.name, schema: OrdersSchema }]),
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductsSchema },
    ]),
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: License.name, schema: LicenseSchema }]),
  ],
})
export class OrdersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: `${config.get('appPrefix')}/orders/webhook`,
        method: RequestMethod.POST,
      })
      .forRoutes(OrdersController);
  }
}
