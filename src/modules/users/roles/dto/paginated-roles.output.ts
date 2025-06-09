import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationMetadataDto } from '@common/dtos/pagination/pagination-metadata.dto';
import { Role } from '../entities/role.entity';

@ObjectType({
  description: 'Paginated response for roles',
})
export class PaginatedRolesOutput {
  @Field(() => [Role], {
    description: 'List of roles on the current page',
  })
  items: Role[];

  @Field(() => PaginationMetadataDto, {
    description:
      'Pagination metadata including page, limit, total items, and total pages',
  })
  meta: PaginationMetadataDto;
}
