import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationMetadataDto } from '@common/dtos/pagination/pagination-metadata.dto';
import { Tag } from '../entities/tag.entity';

@ObjectType({
  description: 'Paginated response for tags',
})
export class PaginatedTagsOutput {
  @Field(() => [Tag], {
    description: 'List of tags on the current page',
  })
  items: Tag[];

  @Field(() => PaginationMetadataDto, {
    description:
      'Pagination metadata including page, limit, total items, and total pages',
  })
  meta: PaginationMetadataDto;
}
