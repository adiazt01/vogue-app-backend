import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  providers: [RolesResolver, RolesService],
  imports: [PermissionsModule],
})
export class RolesModule {}
