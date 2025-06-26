import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StatusOrder } from '@orders/enums/status-order.enum';
import { Product } from '@products/schemas/product.schema';
import { User } from '@users/schemas/user.schema';
import { Document, HydratedDocument, PopulatedDoc, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Order extends Document {
  declare _id: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  buyer: User;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: Product.name, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        seller: { type: Types.ObjectId, ref: User.name, required: true },
      },
    ],
    required: true,
    _id: false,
  })
  products: Array<{
    product: Product;
    quantity: number;
    seller: User;
  }>;

  @Prop({
    enum: StatusOrder,
    default: StatusOrder.PENDING,
    required: true,
  })
  status: StatusOrder;
}

export type OrderDocument = HydratedDocument<Order>;

export type OrderDocumentOverride = {
  products: Array<{
    product: PopulatedDoc<Product>;
    seller: PopulatedDoc<User>;
    quantity: number;
    price: number;
  }>;
  seller: PopulatedDoc<User>;
  buyer: PopulatedDoc<User>;
};

export const OrderSchema = SchemaFactory.createForClass(Order);
