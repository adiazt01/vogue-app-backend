import { Field, InputType } from '@nestjs/graphql';
import { ActionsPermissions } from '@users/enums/actions-permissions.enum';
import { Resources } from '@users/enums/resources.enum';

@InputType({
  description: 'Input type for creating a new permission',
})
export class CreatePermissionInput {
  @Field(() => ActionsPermissions, {
    description: 'The action associated with the permission',
    nullable: false,
  })
  action: ActionsPermissions;

  @Field(() => Resources, {
    description: 'The resource associated with the permission',
    nullable: false,
  })
  resource: Resources;
}
