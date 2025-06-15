import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '@users/entities/user.entity';
import { Types } from 'mongoose';
import { OrderProduct } from './order-product.entity';

@ObjectType()
export class Order {
  @Field(() => ID, { description: 'The unique identifier of the order' })
  _id: Types.ObjectId;

  @Field(() => User, { description: 'The ID of the buyer' })
  buyer: Types.ObjectId;

  @Field(() => [OrderProduct], { description: 'List of products in the order' })
  products: Array<OrderProduct>;
}
