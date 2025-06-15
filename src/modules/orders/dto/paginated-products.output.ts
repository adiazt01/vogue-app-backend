import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationMetadataDto } from '@common/dtos/pagination/pagination-metadata.dto';
import { Order } from '@orders/entities/order.entity';

@ObjectType({
  description: 'Paginated response for orders',
})
export class PaginatedOrdersOutput {
  @Field(() => [Order], {
    description: 'List of orders  on the current page',
  })
  items: Order[];

  @Field(() => PaginationMetadataDto, {
    description:
      'Pagination metadata including page, limit, total items, and total pages',
  })
  meta: PaginationMetadataDto;
}
