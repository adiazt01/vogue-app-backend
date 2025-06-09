import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@users/entities/user.entity';

@ObjectType({
  description: 'Authentication entity containing user information',
})
export class Auth {
  @Field(() => User, {
    description: 'User associated with the authentication',
  })
  user: User;

  @Field(() => String, {
    description: 'Access token for the authenticated user',
  })
  accessToken: string;

  @Field(() => String, {
    description: 'Refresh token for the authenticated user',
  })
  refreshToken: string;
}
