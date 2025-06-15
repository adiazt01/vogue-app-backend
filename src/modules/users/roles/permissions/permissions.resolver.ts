import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PermissionsService } from './permissions.service';
import { Permission } from './entity/permission.entity';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UseGuards } from '@nestjs/common';
import { AbilitiesGuard } from '@auth/guards/abilities.guard';
import { RESOURCES } from '@users/enums/resources.enum';
import { ACTIONS_PERMISSIONS } from '@users/enums/actions-permissions.enum';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { CheckAbility } from '@auth/decorators/check-ability.decorator';
import { PaginatedPermissionsOutput } from './dto/paginated-permissions.output';
import { PaginationPermissionsOptionsArgs } from '../dto/pagination-roles-options.args';

// TODO Definir correctamente como los permisos de inicializaran en el sistema

@Resolver(() => Permission)
export class PermissionsResolver {
  constructor(private readonly permissionsService: PermissionsService) {}

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbility(ACTIONS_PERMISSIONS.CREATE, RESOURCES.PERMISSIONS)
  @Mutation(() => Permission, { name: 'createPermission' })
  async createPermission(
    @Args('createPermissionInput') createPermissionInput: CreatePermissionInput,
  ): Promise<Permission> {
    return this.permissionsService.create(createPermissionInput);
  }

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbility(ACTIONS_PERMISSIONS.READ, RESOURCES.PERMISSIONS)
  @Query(() => PaginatedPermissionsOutput, { name: 'permissions' })
  async getAllPermissions(
    @Args() paginationPermissionsOptions: PaginationPermissionsOptionsArgs,
  ) {
    return this.permissionsService.findAll(paginationPermissionsOptions);
  }
}
