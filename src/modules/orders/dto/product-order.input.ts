import { Field, InputType, Int } from '@nestjs/graphql';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Types } from 'mongoose';

@InputType({
  description: 'Input type for product order details',
})
export class ProductOrderInput {
  @Field(() => String, {
    description: 'The ID of the product',
    nullable: false,
  })
  @Type(() => ParseObjectIdPipe)
  @IsNotEmpty()
  productId: Types.ObjectId;

  @Field(() => Int, {
    description: 'The quantity of the product',
    nullable: false,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
