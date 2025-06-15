import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Permission } from './permissions/entity/permission.entity';
import { Role } from './entities/role.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UseGuards } from '@nestjs/common';
import { AbilitiesGuard } from '@auth/guards/abilities.guard';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { CheckAbility } from '@auth/decorators/check-ability.decorator';
import { ACTIONS_PERMISSIONS } from '@users/enums/actions-permissions.enum';
import { RESOURCES } from '@users/enums/resources.enum';
import { UpdatePermissionFromRoleInput } from './dto/update-permission-from-role.input';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbility(ACTIONS_PERMISSIONS.CREATE, RESOURCES.ROLES)
  @Mutation(() => Role, {
    description: 'Create a new role with optional permissions',
  })
  async createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
    return this.rolesService.create(createRoleInput);
  }

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbility(ACTIONS_PERMISSIONS.UPDATE, RESOURCES.ROLES)
  @Mutation(() => Role, {
    description: 'Assign permissions to an existing role',
  })
  async assignPermissionsToRole(
    @Args('updatePermissionFromRoleInput') updatePermissionFromRoleInput: UpdatePermissionFromRoleInput,
  ) {
    return this.rolesService.addPermissionToRole(updatePermissionFromRoleInput);
  }

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbility(ACTIONS_PERMISSIONS.UPDATE, RESOURCES.ROLES)
  @Mutation(() => Role, {
    description: 'Remove permissions from an existing role',
  })
  async removePermissionsFromRole(
    @Args('updatePermissionFromRoleInput') updatePermissionFromRoleInput: UpdatePermissionFromRoleInput,
  ) {
    return this.rolesService.removePermissionFromRole(updatePermissionFromRoleInput);
  }

  @ResolveField(() => [Permission], {
    name: 'permissions',
    description: 'Get permissions of the role',
  })
  async getPermissions(@Parent() role: Role) {
    return this.rolesService.getRolePermissions(role._id);
  }
}
