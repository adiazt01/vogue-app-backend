import { ACTIONS_PERMISSIONS } from '@users/enums/actions-permissions.enum';
import { RESOURCES } from '@users/enums/resources.enum';
import { CreateRoleInput } from '@users/roles/dto/create-role.input';
import { RolesService } from '@users/roles/roles.service';
import { plainToInstance } from 'class-transformer';
import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'roles:seed',
  description: 'Seed the database with default roles',
})
export class RoleSeed extends CommandRunner {
  constructor(private readonly roleService: RolesService) {
    super();
  }

  async run() {
    const permissionsForAdminPermissionResource = [
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

    const permissionsForAdminRoleResource = [
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

    const permissionsForAdminUserResource = [
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

    const permissionsForAdminCategoriesResource = [
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

    const permissionsForAdminProducts = [
      {
        action: ACTIONS_PERMISSIONS.CREATE,
        resource: RESOURCES.PRODUCTS,
      },
      {
        action: ACTIONS_PERMISSIONS.READ,
        resource: RESOURCES.PRODUCTS,
      },
      {
        action: ACTIONS_PERMISSIONS.UPDATE,
        resource: RESOURCES.PRODUCTS,
      },
      {
        action: ACTIONS_PERMISSIONS.DELETE,
        resource: RESOURCES.PRODUCTS,
      },
    ];

    const permissionsAdmin = [
      ...permissionsForAdminPermissionResource,
      ...permissionsForAdminRoleResource,
      ...permissionsForAdminUserResource,
      ...permissionsForAdminCategoriesResource,
      ...permissionsForAdminProducts,
    ];

    // USER FOR THE PLATFORM
    const permissionsForUserRoleUserResource = [
      {
        action: ACTIONS_PERMISSIONS.READ,
        resource: RESOURCES.USERS,
      },
    ];

    const permissionsForUserRoleCategoriesResource = [
      {
        action: ACTIONS_PERMISSIONS.READ,
        resource: RESOURCES.CATEGORIES,
      },
    ];

    const permissionsForUserRoleProductsResource = [
      {
        action: ACTIONS_PERMISSIONS.READ,
        resource: RESOURCES.PRODUCTS,
      },
    ];

    const permissionsForUserRole = [
      ...permissionsForUserRoleUserResource,
      ...permissionsForUserRoleCategoriesResource,
      ...permissionsForUserRoleProductsResource,
    ];

    // SELLER FOR THE PLATFORM
    const permissionsForSeller = [
      // Productos
      { action: ACTIONS_PERMISSIONS.CREATE, resource: RESOURCES.PRODUCTS },
      { action: ACTIONS_PERMISSIONS.READ, resource: RESOURCES.PRODUCTS },
      { action: ACTIONS_PERMISSIONS.UPDATE, resource: RESOURCES.PRODUCTS },
      { action: ACTIONS_PERMISSIONS.DELETE, resource: RESOURCES.PRODUCTS },

      // Órdenes
      { action: ACTIONS_PERMISSIONS.READ, resource: RESOURCES.ORDERS },
      { action: ACTIONS_PERMISSIONS.UPDATE, resource: RESOURCES.ORDERS },

      // Categorías
      { action: ACTIONS_PERMISSIONS.READ, resource: RESOURCES.CATEGORIES },

      // Perfil de usuario
      { action: ACTIONS_PERMISSIONS.READ, resource: RESOURCES.USERS },
      { action: ACTIONS_PERMISSIONS.UPDATE, resource: RESOURCES.USERS },
    ];

    const createdAdminRoleInput = plainToInstance(CreateRoleInput, {
      name: 'ADMIN',
      description: 'Administrator role with all permissions',
      permissions: permissionsAdmin,
    });

    const createdSellerRoleInput = plainToInstance(CreateRoleInput, {
      name: 'SELLER',
      description: 'Seller role with permissions to manage products and orders',
      permissions: permissionsForSeller,
    });

    const createdUserRoleInput = plainToInstance(CreateRoleInput, {
      name: 'USER',
      description: 'User role with basic permissions',
      isDefault: true,
      permissions: permissionsForUserRole,
    });

    await this.roleService.create(createdAdminRoleInput);
    await this.roleService.create(createdUserRoleInput);
    await this.roleService.create(createdSellerRoleInput);

    console.log('Roles seeded successfully');
  }
}
