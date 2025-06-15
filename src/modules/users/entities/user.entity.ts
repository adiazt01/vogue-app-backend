import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '@users/roles/entities/role.entity';

@ObjectType({
  description: 'User entity representing a user in the system',
})
export class User {
  @Field(() => ID, { description: 'Unique identifier for the user' })
  _id: string;

  @Field(() => String, { description: 'Username of the user' })
  username: string;

  @Field(() => String, { description: 'Email of the user' })
  email: string;

  @Field(() => [Role], { description: 'Roles assigned to the user' })
  roles: Role[];
}
