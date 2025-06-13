import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '@users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '@config/env.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '@users/users.service';
import { AbilityFactory } from './factories/ability.factory';
import { AbilitiesGuard } from './guards/abilities.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesModule } from '@users/roles/roles.module';
import { RolesService } from '@users/roles/roles.service';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    JwtModule.register({
      secret: envs.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    RolesService,
    UsersService,
    JwtStrategy,
    AbilityFactory,
    AbilitiesGuard,
    JwtAuthGuard,
  ],
  exports: [AbilityFactory, AbilitiesGuard, JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
