import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description:
    'Permission entity representing a specific permission in the system',
})
export class Permission {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  action: string;

  @Field(() => String)
  resource: string;
}
