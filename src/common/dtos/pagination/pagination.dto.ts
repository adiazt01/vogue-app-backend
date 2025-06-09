import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationMetadataDto } from './pagination-metadata.dto';

@ObjectType({
  isAbstract: true,
  description: 'Base class for paginated responses',
})
export abstract class PaginationDto<T> {
  @Field(() => [Object], { description: 'Items on the current page' })
  items: T[];

  @Field(() => PaginationMetadataDto, { description: 'Pagination metadata' })
  meta: PaginationMetadataDto;
}
