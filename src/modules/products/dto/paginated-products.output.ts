import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationMetadataDto } from '@common/dtos/pagination/pagination-metadata.dto';
import { Product } from '../entities/product.entity';

@ObjectType({
  description: 'Paginated response for categories',
})
export class PaginatedProductsOutput {
  @Field(() => [Product], {
    description: 'List of products on the current page',
  })
  items: Product[];

  @Field(() => PaginationMetadataDto, {
    description:
      'Pagination metadata including page, limit, total items, and total pages',
  })
  meta: PaginationMetadataDto;
}
