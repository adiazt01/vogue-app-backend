import { registerEnumType } from "@nestjs/graphql";

export enum ACTIONS_PERMISSIONS {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  MANAGE = 'MANAGE',
}

registerEnumType(ACTIONS_PERMISSIONS, {
  name: 'ACTIONS_PERMISSIONS',
  description: 'Enum for actions that can be performed on resources',
});