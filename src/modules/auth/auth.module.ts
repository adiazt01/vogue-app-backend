import { Module } from '@nestjs/common';
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
import { forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoggerService } from '@common/logger/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './schemas/otp.schema';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    JwtModule.register({
      secret: envs.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    MongooseModule.forFeature([{
      name: Otp.name,
      schema: OtpSchema,
    }])
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
    LoggerService,
  ],
  exports: [AbilityFactory, AbilitiesGuard, JwtAuthGuard, JwtStrategy],
})
export class AuthModule { }
