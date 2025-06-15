import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Connection, Model } from 'mongoose';
import { ProductsService } from '@products/products.service';
import { LoggerService } from '@common/logger/logger.service';
import { StatusOrder } from './enums/status-order.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly productsService: ProductsService,
    private readonly loggerService: LoggerService,
  ) {}

  async create(createOrderInput: CreateOrderInput, userId: string) {
    const { products } = createOrderInput;

    const productsValidates =
      await this.productsService.validateProductsAndStock({
        products: products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
      });

    const totalPrice = productsValidates.reduce(
      (total, product) =>
        total +
        product.price *
          (products.find(
            (p) => p.productId.toString() === product._id.toString(),
          )?.quantity || 0),
      0,
    );

    if (!productsValidates) {
      throw new BadRequestException(`Invalid products`);
    }

    const session = await this.connection.startSession();

    session.startTransaction();

    this.loggerService.debug(
      `Creating order with products: ${JSON.stringify(productsValidates)}`,
    );

    const order = new this.orderModel({
      products: productsValidates.map((product) => ({
        product: product._id,
        quantity: products.find(
          (p) => p.productId.toString() === product._id.toString(),
        )?.quantity,
        price: product.price,
        seller: product.owner._id,
      })),
      total: totalPrice,
      status: StatusOrder.PENDING,
      buyer: userId,
    });

    await order.save();

    for (const product of products) {
      await this.productsService.reduceStock(
        {
          productId: product.productId,
          quantity: product.quantity,
        },
        session,
      );
    }

    await session.commitTransaction();
    await session.endSession();

    this.loggerService.log(`New order created: ${order._id}`);

    return order;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderInput: UpdateOrderInput) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
