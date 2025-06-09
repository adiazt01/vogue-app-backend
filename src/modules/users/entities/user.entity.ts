import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String, { description: 'Username of the user' })
  username: string;

  @Field(() => String, { description: 'Email of the user' })
  email: string;
}
