import { SetMetadata } from '@nestjs/common';
import { ActionsPermissions } from '@users/enums/actions-permissions.enum';
import { Resources } from '@users/enums/resources.enum';

export const CheckAbility = (
  action: ActionsPermissions,
  resource: Resources,
) => {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<unknown>,
  ) => {
    SetMetadata('action', action)(target, propertyKey, descriptor);
    SetMetadata('resource', resource)(target, propertyKey, descriptor);
  };
};
