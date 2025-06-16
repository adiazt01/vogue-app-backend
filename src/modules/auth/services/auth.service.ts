import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '@common/hash/hash.service';
import { RolesService } from '@users/roles/roles.service';
import { RefreshTokenInput } from '@auth/dto/refresh-token.input';
import { envs } from '@config/env.config';
import { Tokens } from '@auth/interfaces/tokens.interface';
import { LoggerService } from '@common/logger/logger.service';
import { RegisterInput } from '@auth/dto/register.input';
import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { LoginInput } from '@auth/dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly JwtService: JwtService,
    private readonly hashService: HashService,
    private readonly rolesService: RolesService,
    private readonly loggerService: LoggerService,
  ) { }

  async register(registerInput: RegisterInput) {
    const registerUser = await this.usersService.create(registerInput);

    const defaultRole = await this.rolesService.findByDefault();

    if (!defaultRole) {
      throw new InternalServerErrorException('Default role is not assigned');
    }

    const newUserRegisteredWithDefaultRole =
      await this.usersService.assignRoleToUser({
        userId: registerUser._id,
        roleId: defaultRole._id,
      });

    if (!newUserRegisteredWithDefaultRole) {
      throw new InternalServerErrorException('Failed to register user');
    }

    const { email, username, _id } = newUserRegisteredWithDefaultRole;

    const jwtPayload: JwtPayload = {
      email,
      username,
      sub: _id.toString(),
    };

    const { accessToken, refreshToken } = await this.generateTokens(jwtPayload);

    return {
      accessToken,
      refreshToken,
      user: registerUser,
    };
  }

  async login(loginInput: LoginInput) {
    const userFound = await this.usersService.findOneByEmail(loginInput.email);

    if (!userFound) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await this.hashService.compare(
      loginInput.password,
      userFound.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const { email, username, _id } = userFound;

    const jwtPayload: JwtPayload = {
      email,
      username,
      sub: _id.toString(),
    };

    const { accessToken, refreshToken } = await this.generateTokens(jwtPayload);

    return {
      accessToken,
      refreshToken,
      user: userFound,
    };
  }

  async refreshToken(refreshTokenInput: RefreshTokenInput) {
    const { refreshToken } = refreshTokenInput;

    const payload = await this.JwtService.verifyAsync(refreshToken, {
      secret: envs.JWT_REFRESH_SECRET,
    });

    const user = await this.usersService.findOne(payload.sub);

    if (!user) throw new UnauthorizedException('Invalid refresh token');

    const jwtPayload: JwtPayload = {
      email: user.email,
      username: user.username,
      sub: user._id.toString(),
    };

    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(jwtPayload);


    return {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    };
  }

  private async generateTokens(user: JwtPayload): Promise<Tokens> {
    const accessToken = await this.JwtService.signAsync(user, {
      expiresIn: envs.JWT_EXPIRATION,
      secret: envs.JWT_SECRET,
    });

    const refreshToken = await this.JwtService.signAsync(user, {
      expiresIn: envs.JWT_REFRESH_EXPIRATION,
      secret: envs.JWT_REFRESH_SECRET,
    });

    if (!accessToken || !refreshToken) {
      throw new InternalServerErrorException('Failed to generate tokens');
    }

    return { accessToken, refreshToken };
  }
}