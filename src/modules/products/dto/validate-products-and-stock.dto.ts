import { PickType } from '@nestjs/graphql';
import { ProductOrderInput } from '@orders/dto/product-order.input';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

type ProductOrderPick = Pick<ProductOrderInput, 'productId' | 'quantity'>;

export class ValidateProductsAndStock {
  @IsArray()
  @Type(() => PickType(ProductOrderInput, ['productId', 'quantity']))
  products: ProductOrderPick[];
}
