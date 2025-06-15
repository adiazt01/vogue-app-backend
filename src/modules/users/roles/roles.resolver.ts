import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Permission } from './permissions/entity/permission.entity';
import { Role } from './entities/role.entity';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @ResolveField(() => [Permission], {
    name: 'permissions',
    description: 'Get permissions of the role',
  })
  async getPermissions(@Parent() role: Role) {
    return this.rolesService.getRolePermissions(role._id);
  }
}
