import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Permission } from '../permissions/entity/permission.entity';

@ObjectType({
  description: 'Role entity representing a specific role in the system',
})
export class Role {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [Permission])
  permissions: Permission[];
}
