import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

@InputType({
  description: 'Input type for updating permissions from a role',
})
export class UpdatePermissionFromRoleInput {
  @Field(() => String, {
    description: 'The ID of the role to update permissions for',
    nullable: false,
  })
  @Type(() => Types.ObjectId)
  roleId: Types.ObjectId;

  @Field(() => [String], {
    description: 'List of permission IDs to remove from the role',
    nullable: false,
  })
  @Type(() => Types.ObjectId)
  permissionIds: Types.ObjectId[];
}
