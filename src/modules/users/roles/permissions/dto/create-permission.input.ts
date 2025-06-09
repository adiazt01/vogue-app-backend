import { Field, InputType } from '@nestjs/graphql';
import { ACTIONS_PERMISSIONS } from '@users/enums/actions-permissions.enum';
import { RESOURCES } from '@users/enums/resources.enum';

@InputType({
  description: 'Input type for creating a new permission',
})
export class CreatePermissionInput {
  @Field(() => ACTIONS_PERMISSIONS, {
    description: 'The action associated with the permission',
    nullable: false,
  })
  action: ACTIONS_PERMISSIONS;

  @Field(() => RESOURCES, {
    description: 'The resource associated with the permission',
    nullable: false,
  })
  resource: RESOURCES;
}
