import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { HashService } from '@common/hash/hash.service';
import { RolesModule } from './roles/roles.module';
import {
  Permission,
  PermissionSchema,
} from './roles/permissions/schemas/permission.schema';
import { Role, RoleSchema } from './roles/schemas/role.schema';
import { UserSeed } from './commands/seeds/users.seed';
import { LoggerService } from '@common/logger/logger.service';
import { RolesService } from './roles/roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
    ]),
    forwardRef(() => RolesModule),
  ],
  providers: [
    UsersService,
    LoggerService,
    UsersResolver,
    HashService,
    RolesService,
    UserSeed,
  ],
  exports: [UsersService, HashService, MongooseModule, LoggerService],
})
export class UsersModule {}
