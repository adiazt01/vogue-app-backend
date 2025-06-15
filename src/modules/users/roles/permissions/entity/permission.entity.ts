import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType({
  description:
    'Permission entity representing a specific permission in the system',
})
export class Permission {
  @Field(() => ID, {
    description: 'The unique identifier of the permission',
    nullable: false,
  })
  _id: Types.ObjectId;

  @Field(() => String, {
    description: 'The action associated with the permission',
    nullable: false,
  })
  action: string;

  @Field(() => String, {
    description: 'The resource associated with the permission',
    nullable: false,
  })
  resource: string;
}
