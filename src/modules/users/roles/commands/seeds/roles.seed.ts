import { ACTIONS_PERMISSIONS } from '@users/enums/actions-permissions.enum';
import { RESOURCES } from '@users/enums/resources.enum';
import { CreateRoleInput } from '@users/roles/dto/create-role.input';
import { PermissionsService } from '@users/roles/permissions/permissions.service';
import { RolesService } from '@users/roles/roles.service';
import { plainToInstance } from 'class-transformer';
import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'roles:seed',
  description: 'Seed the database with default roles',
})
export class RoleSeed extends CommandRunner {
  constructor(
    private readonly roleService: RolesService,
    private readonly permissionService: PermissionsService,
  ) {
    super();
  }

  async run() {
    const permissionsForPermissionResource = [
      {
        action: ACTIONS_PERMISSIONS.CREATE,
        resource: RESOURCES.PERMISSIONS,
      },
      {
        action: ACTIONS_PERMISSIONS.READ,
        resource: RESOURCES.PERMISSIONS,
      },
      {
        action: ACTIONS_PERMISSIONS.UPDATE,
        resource: RESOURCES.PERMISSIONS,
      },
      {
        action: ACTIONS_PERMISSIONS.DELETE,
        resource: RESOURCES.PERMISSIONS,
      },
    ];

    const permissionsForRoleResource = [
      {
        action: ACTIONS_PERMISSIONS.CREATE,
        resource: RESOURCES.ROLES,
      },
      {
        action: ACTIONS_PERMISSIONS.READ,
        resource: RESOURCES.ROLES,
      },
      {
        action: ACTIONS_PERMISSIONS.UPDATE,
        resource: RESOURCES.ROLES,
      },
      {
        action: ACTIONS_PERMISSIONS.DELETE,
        resource: RESOURCES.ROLES,
      },
    ];

    const permissionsForUserResource = [
      {
        action: ACTIONS_PERMISSIONS.CREATE,
        resource: RESOURCES.USERS,
      },
      {
        action: ACTIONS_PERMISSIONS.READ,
        resource: RESOURCES.USERS,
      },
      {
        action: ACTIONS_PERMISSIONS.UPDATE,
        resource: RESOURCES.USERS,
      },
      {
        action: ACTIONS_PERMISSIONS.DELETE,
        resource: RESOURCES.USERS,
      },
    ];

    const permissionsForCategoriesResource = [
      {
        action: ACTIONS_PERMISSIONS.CREATE,
        resource: RESOURCES.CATEGORIES,
      },
      {
        action: ACTIONS_PERMISSIONS.READ,
        resource: RESOURCES.CATEGORIES,
      },
      {
        action: ACTIONS_PERMISSIONS.UPDATE,
        resource: RESOURCES.CATEGORIES,
      },
      {
        action: ACTIONS_PERMISSIONS.DELETE,
        resource: RESOURCES.CATEGORIES,
      },
    ];

    const permissions = [
      ...permissionsForPermissionResource,
      ...permissionsForRoleResource,
      ...permissionsForUserResource,
      ...permissionsForCategoriesResource,
    ];

    const createdAdminRoleInput = plainToInstance(CreateRoleInput, {
      name: 'ADMIN',
      description: 'Administrator role with all permissions',
      permissions,
    });

    await this.roleService.create(createdAdminRoleInput);

    console.log('Roles seeded successfully');
  }
}
