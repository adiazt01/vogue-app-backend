import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsResolver } from './permissions.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './schemas/permission.schema';
import { LoggerService } from '@common/logger/logger.service';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
    ]),
    AuthModule,
  ],
  providers: [PermissionsResolver, PermissionsService, LoggerService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
