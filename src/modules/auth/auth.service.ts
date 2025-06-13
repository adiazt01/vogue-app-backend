import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { RegisterInput } from './dto/register.input';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { HashService } from '@common/hash/hash.service';
import { LoginInput } from './dto/login.input';
import { RolesService } from '@users/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly JwtService: JwtService,
    private readonly hashService: HashService,
    private readonly rolesService: RolesService,
  ) {}

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

    return {
      accessToken: await this.JwtService.signAsync(jwtPayload),
      refreshToken: await this.JwtService.signAsync(jwtPayload, {
        expiresIn: '7d',
      }),
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

    return {
      accessToken: await this.JwtService.signAsync(jwtPayload),
      refreshToken: await this.JwtService.signAsync(jwtPayload, {
        expiresIn: '7d',
      }),
      user: userFound,
    };
  }
}
