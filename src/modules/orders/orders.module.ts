import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { AuthModule } from '@auth/auth.module';
import { ProductsModule } from '@products/products.module';
import { ProductsService } from '@products/products.service';
import { LoggerService } from '@common/logger/logger.service';
import { OrdersProductResolver } from './orders-product.resolver';

@Module({
  imports: [
    AuthModule,
    ProductsModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  providers: [OrdersResolver, OrdersProductResolver, OrdersService, ProductsService, LoggerService],
})
export class OrdersModule { }
