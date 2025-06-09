import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { PermissionsModule } from './permissions/permissions.module';
import { Role, RoleSchema } from './schemas/role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Permission,
  PermissionSchema,
} from './permissions/schemas/permission.schema';
import { RoleSeed } from './commands/seeds/roles.seed';

@Module({
  imports: [
    PermissionsModule,
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
    ]),
  ],
  providers: [RolesResolver, RolesService, RoleSeed],
})
export class RolesModule {}
