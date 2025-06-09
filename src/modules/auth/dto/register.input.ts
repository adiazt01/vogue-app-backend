import { InputType, OmitType } from '@nestjs/graphql';
import { CreateUserInput } from '@users/dto/create-user.input';

@InputType({
  description: 'Input type for registering a new user',
})
export class RegisterInput extends OmitType(CreateUserInput, []) {}
