import { IsString } from 'class-validator';
import { CreateProductInput } from './create-product.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

@InputType({
  description: 'Input to update a product',
})
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => ID, { description: 'ID of the product to update' })
  @IsString()
  @Type(() => ParseObjectIdPipe)
  id: Types.ObjectId;
}
