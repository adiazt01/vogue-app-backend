import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { PaginationMetadataDto } from '@common/dtos/pagination/pagination-metadata.dto';

@ObjectType({
  description: 'Paginated response for users',
})
export class PaginatedUsersOutput {
  @Field(() => [User], {
    description: 'List of users on the current page',
  })
  items: User[];

  @Field(() => PaginationMetadataDto, {
    description:
      'Pagination metadata including page, limit, total items, and total pages',
  })
  meta: PaginationMetadataDto;
}
