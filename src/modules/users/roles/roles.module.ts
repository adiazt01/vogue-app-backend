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
import { PermissionsService } from './permissions/permissions.service';
import { LoggerService } from '@common/logger/logger.service';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    AuthModule,
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
  providers: [
    RolesResolver,
    PermissionsService,
    RolesService,
    RoleSeed,
    LoggerService,
  ],
  exports: [RolesService, PermissionsService],
})
export class RolesModule {}
