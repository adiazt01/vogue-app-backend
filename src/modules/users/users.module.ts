import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { HashService } from '@common/hash/hash.service';
import { UserSeed } from './commands/seeds/user.seed';
import { RolesModule } from './roles/roles.module';
import {
  Permission,
  PermissionSchema,
} from './roles/permissions/schemas/permission.schema';
import { Role, RoleSchema } from './roles/schemas/role.schema';

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
    RolesModule,
  ],
  providers: [UsersResolver, UsersService, HashService, UserSeed],
  exports: [UsersService, HashService, MongooseModule],
})
export class UsersModule {}
