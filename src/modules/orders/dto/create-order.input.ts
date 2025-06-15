import { InputType, Field } from '@nestjs/graphql';
import { ProductOrderInput } from './product-order.input';
import { ArrayMinSize, IsArray, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateOrderInput {
  @Field(() => [ProductOrderInput], {
    description: 'The list of products in the order',
    nullable: false,
  })
  @ArrayMinSize(1, {
    message: 'At least one product must be included in the order',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderInput)
  products: ProductOrderInput[];
}
