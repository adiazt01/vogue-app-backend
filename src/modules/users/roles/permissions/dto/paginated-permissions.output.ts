import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationMetadataDto } from '@common/dtos/pagination/pagination-metadata.dto';
import { Permission } from '../entity/permission.entity';

@ObjectType({
  description: 'Paginated response for roles',
})
export class PaginatedPermissionsOutput {
  @Field(() => [Permission], {
    description: 'List of permissions on the current page',
  })
  items: Permission[];

  @Field(() => PaginationMetadataDto, {
    description:
      'Pagination metadata including page, limit, total items, and total pages',
  })
  meta: PaginationMetadataDto;
}
