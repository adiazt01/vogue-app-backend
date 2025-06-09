import { SetMetadata } from '@nestjs/common';
import { ACTIONS_PERMISSIONS } from '@users/enums/actions-permissions.enum';
import { RESOURCES } from '@users/enums/resources.enum';

export const CheckAbility = (
  action: ACTIONS_PERMISSIONS,
  resource: RESOURCES,
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
