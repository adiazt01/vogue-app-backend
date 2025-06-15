import { Field, InputType, Int } from '@nestjs/graphql';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsCurrency, IsInt, IsNotEmpty, Min } from 'class-validator';

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
  productId: string;

  @Field(() => Int, {
    description: 'The quantity of the product',
    nullable: false,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  @Field(() => Int, {
    description: 'The price of the product',
    nullable: false,
  })
  @IsNotEmpty()
  @IsCurrency()
  @Min(0)
  price: number;
}
