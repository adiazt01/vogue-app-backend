import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Permission } from '../permissions/entity/permission.entity';

@ObjectType({
  description: 'Role entity representing a specific role in the system',
})
export class Role {
  @Field(() => ID, {
    description: 'The unique identifier of the role',
    nullable: false,
  })
  id: string;

  @Field(() => String, {
    description: 'The name of the role',
    nullable: false,
  })
  name: string;

  @Field(() => Boolean, {
    description: 'Whether the role is the default role',
    nullable: false,
  })
  isDefault: boolean;

  @Field(() => [Permission], {
    description: 'The permissions associated with the role',
    nullable: false,
  })
  permissions: Permission[];
}
