import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  MongoAbility,
} from '@casl/ability';
import { UsersService } from '@users/users.service';
import { ACTIONS_PERMISSIONS } from '@users/enums/actions-permissions.enum';
import { RESOURCES } from '@users/enums/resources.enum';

export type AppAbility = MongoAbility<[ACTIONS_PERMISSIONS, RESOURCES]>;

@Injectable()
export class AbilityFactory {
  constructor(private readonly usersService: UsersService) {}

  async defineAbilityForUser(userId: string): Promise<MongoAbility> {
    const userWithRoles = await this.usersService.findOne(userId);

    if (!userWithRoles || !userWithRoles.roles || !userWithRoles.roles.length) {
      throw new NotFoundException(`User dont have any roles`);
    }

    const { can, build } = new AbilityBuilder<MongoAbility>(createMongoAbility);

    userWithRoles?.roles.forEach((role) => {
      role?.permissions?.forEach((permission) => {
        can(permission.action, permission.resource);
      });
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<AppAbility>,
    });
  }
}
