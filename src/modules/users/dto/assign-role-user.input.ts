import { Field, ID, InputType } from '@nestjs/graphql';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

@InputType({
  description: 'Input type for assigning a role to a user',
})
export class AssignRoleUserInput {
  @Field(() => ID, {
    description: 'The ID of the user to assign the role to',
  })
  @Type(() => ParseObjectIdPipe)
  userId: Types.ObjectId;

  @Field(() => ID, {
    description: 'The ID of the role to assign to the user',
  })
  @Type(() => ParseObjectIdPipe)
  roleId: Types.ObjectId;
}
