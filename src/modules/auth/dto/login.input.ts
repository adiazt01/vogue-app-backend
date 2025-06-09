import { InputType, PickType } from '@nestjs/graphql';
import { CreateUserInput } from '@users/dto/create-user.input';

@InputType({
  description: 'Input type for logging in a user',
})
export class LoginInput extends PickType(CreateUserInput, [
  'email',
  'password',
]) {}
