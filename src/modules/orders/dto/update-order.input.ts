import { Types } from 'mongoose';
import { CreateOrderInput } from './create-order.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@InputType()
export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @Field(() => ID, { description: 'The ID of the order to update' })
  @Type(() => Types.ObjectId)
  id: Types.ObjectId;
}
