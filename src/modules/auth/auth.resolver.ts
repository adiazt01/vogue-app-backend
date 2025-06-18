import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Auth } from './entities/auth.entity';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthService } from './services/auth.service';
import { RefreshTokenInput } from './dto/refresh-token.input';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

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

  @Mutation(() => Auth, {
    name: 'RefreshToken',
    description: 'Refresh the authentication tokens for a user',
  })
  refreshToken(@Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput) {
    return this.authService.refreshToken(refreshTokenInput);
  }

  // TODO Reset password for user with otp
  // TODO Confirm email for user with otp
  // TODO Delete user account with OTP confirmation
}
