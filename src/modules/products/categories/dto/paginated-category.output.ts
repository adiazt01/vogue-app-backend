import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationMetadataDto } from '@common/dtos/pagination/pagination-metadata.dto';
import { Category } from '../entities/category.entity';

@ObjectType({
  description: 'Paginated response for categories',
})
export class PaginatedCategoriesOutput {
  @Field(() => [Category], {
    description: 'List of categories on the current page',
  })
  items: Category[];

  @Field(() => PaginationMetadataDto, {
    description:
      'Pagination metadata including page, limit, total items, and total pages',
  })
  meta: PaginationMetadataDto;
}
