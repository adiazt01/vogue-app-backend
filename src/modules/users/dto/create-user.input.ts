import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType({
  description: 'Input type for creating a new user',
})
export class CreateUserInput {
  @Field({ description: 'Name of the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @Field({ description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field({ description: 'Password of the user' })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
