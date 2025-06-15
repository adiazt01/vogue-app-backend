import { Field, InputType } from '@nestjs/graphql';
import { ACTIONS_PERMISSIONS } from '@users/enums/actions-permissions.enum';
import { RESOURCES } from '@users/enums/resources.enum';
import { IsEnum } from 'class-validator';

@InputType({
  description: 'Input type for creating a new permission',
})
export class CreatePermissionInput {
  @Field(() => ACTIONS_PERMISSIONS, {
    description: 'The action associated with the permission',
    nullable: false,
  })
  @IsEnum(ACTIONS_PERMISSIONS, {
    message:
      'Action must be one of the defined likely ACTIONS_PERMISSIONS: ' +
      Object.values(ACTIONS_PERMISSIONS).join(', '),
  })
  action: ACTIONS_PERMISSIONS;

  @Field(() => RESOURCES, {
    description: 'The resource associated with the permission',
    nullable: false,
  })
  @IsEnum(RESOURCES, {
    message:
      'Resource must be one of the defined likely RESOURCES: ' +
      Object.values(RESOURCES).join(', '),
  })
  resource: RESOURCES;
}
