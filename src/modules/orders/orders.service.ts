import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Connection, Model, Types } from 'mongoose';
import { ProductsService } from '@products/products.service';
import { LoggerService } from '@common/logger/logger.service';
import { StatusOrder } from './enums/status-order.enum';
import { PaginationOrdersOptionsArgs } from './dto/pagination-products-options.args';
import { paginate } from '@common/utils/pagination/paginate.util';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectConnection()
    private readonly productsService: ProductsService,
    private readonly loggerService: LoggerService,
  ) { }

  async create(createOrderInput: CreateOrderInput, userId: Types.ObjectId) {
    const { products } = createOrderInput;

    this.loggerService.debug(
      `Creating order for user ${userId} with products: ${JSON.stringify(products)}`,
    );

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
      );
    }

    this.loggerService.log(`New order created: ${order._id}`);

    return order;
  }

  async findAll(paginationOrdersOptionsArgs: PaginationOrdersOptionsArgs) {
    return await paginate(
      this.orderModel,
      {
        ...paginationOrdersOptionsArgs,
      }
    )
  }

  async findOne(id: Types.ObjectId) {
    const orderFounded = await this.orderModel.findById(id)
      .populate('products.product');


    if (!orderFounded) {
      this.loggerService.error(`Order with ID ${id} not found`);
      throw new NotFoundException(`Order not found with ID ${id}`);
    }

    return orderFounded;
  }

  async update(id: Types.ObjectId, updateOrderInput: UpdateOrderInput) {
    const orderFounded = await this.orderModel.findByIdAndUpdate(id, updateOrderInput, { new: true });

    if (!orderFounded) {
      this.loggerService.error(`Order with ID ${id} not found`);
      throw new NotFoundException(`Order not found with ID ${id}`);
    }

    return orderFounded;
  }

  async remove(id: Types.ObjectId) {
    const orderFounded = await this.orderModel.findByIdAndDelete(id);

    if (!orderFounded) {
      this.loggerService.error(`Order with ID ${id} not found`);
      throw new NotFoundException(`Order not found with ID ${id}`);
    }

    return orderFounded;
  }

  async getBuyerFromOrder(orderId: Types.ObjectId) {
    const orderFound = await this.orderModel.findById(orderId).populate('buyer');

    if (!orderFound) {
      this.loggerService.error(`Order with ID ${orderId} not found`);
      throw new NotFoundException(`Order not found with ID ${orderId}`);
    }

    return orderFound?.buyer;
  }

  async getProductsFromOrder(orderId: Types.ObjectId) {
    const orderFound = await this.orderModel
      .findById(orderId)
      .populate('products.product');
    console.log('Order found:', orderFound);
    if (!orderFound) {
      this.loggerService.error(`Order with ID ${orderId} not found`);
      throw new NotFoundException(`Order not found with ID ${orderId}`);
    }

    return orderFound?.products;
  }

  async getSellerFromOrderProduct(productId: Types.ObjectId) {
    const product = await (await this.productsService.findOne(productId)).populate('owner');

    if (!product) {
      this.loggerService.error(`Product with ID ${productId} not found`);
      throw new NotFoundException(`Product not found with ID ${productId}`);
    }

    return product.owner;
  }
}
