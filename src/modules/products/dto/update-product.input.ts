import { IsString } from 'class-validator';
import { CreateProductInput } from './create-product.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Type } from 'class-transformer';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => String)
  @IsString()
  @Type(() => ParseObjectIdPipe)
  id: String;
}
