import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '@products/entities/product.entity';
import { User } from '@users/entities/user.entity';
import { Types } from 'mongoose';

@ObjectType({
  description: 'Product entity representing an item in the order',
})
export class OrderProduct {
  @Field(() => Product, {
    description: 'The unique identifier of the product',
  })
  product: Types.ObjectId;

  @Field(() => Float, {
    description: 'The price of the product',
  })
  price: number;

  @Field(() => Int, {
    description: 'The quantity of the product ordered',
  })
  quantity: number;

  @Field(() => User, {
    description: 'The seller of the product',
  })
  seller: Types.ObjectId;
}
