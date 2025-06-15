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

  @ResolveField(() => [Permission], {
    name: 'permissions',
    description: 'Get permissions of the role',
  })
  async getPermissions(@Parent() role: Role) {
    return this.rolesService.getRolePermissions(role._id);
  }
}
