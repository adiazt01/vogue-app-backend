import { InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Types } from 'mongoose';

@InputType({
  description: 'Input to update stock of a product',
})
export class UpdateStockProductInput {
  @Type(() => Types.ObjectId)
  @IsNotEmpty()
  productId: Types.ObjectId;

  @Type(() => Number)
  @IsInt()
  @Min(1, {
    message: 'Quantity must be a positive integer',
  })
  quantity: number;
}
