import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { CheckAbility } from './decorators/check-ability.decorator';
import { ActionsPermissions } from '@users/enums/actions-permissions.enum';
import { Resources } from '@users/enums/resources.enum';
import { UseGuards } from '@nestjs/common';
import { AbilitiesGuard } from './guards/abilities.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth, {
    name: 'RegisterUser',
    description: 'Register a new user and return authentication details',
  })
  register(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Mutation(() => Auth, {
    name: 'LoginUser',
    description: 'Login an existing user and return authentication details',
  })
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  // Test authentication guard
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbility(ActionsPermissions.CREATE, Resources.USERS)
  @Query(() => String, {
    name: 'TestAuth',
    description: 'Test endpoint to verify authentication guard',
  })
  testAuth() {
    return 'Authentication successful';
  }
}
