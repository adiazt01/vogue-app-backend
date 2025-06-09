import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { RegisterInput } from './dto/register.input';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { HashService } from '@common/hash/hash.service';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly JwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async register(registerInput: RegisterInput) {
    const registerUser = await this.usersService.create(registerInput);

    const { email, username, _id } = registerUser;

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
