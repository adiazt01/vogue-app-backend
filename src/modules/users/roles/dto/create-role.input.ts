import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreatePermissionInput } from '../permissions/dto/create-permission.input';

@InputType({
  description: 'Input type for creating a new role',
})
export class CreateRoleInput {
  @Field(() => String, {
    description: 'The name of the role to be created',
    nullable: false,
  })
  @IsString()
  name: string;

  @Field(() => String, {
    description: 'A brief description of the role',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Boolean, {
    description: 'Whether the role is the default role',
    nullable: false,
  })
  isDefault: boolean;

  @Field(() => [String], {
    description: 'List of permissions associated with the role',
    nullable: true,
  })
  @Field(() => [CreatePermissionInput], {
    description: 'List of permissions to create with the role',
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @Type(() => CreatePermissionInput)
  permissions: CreatePermissionInput[];
}
