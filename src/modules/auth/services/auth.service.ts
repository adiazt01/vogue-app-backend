import {
  BadRequestException,
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
import { SendOtpInput } from '@auth/dto/send-otp.input';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from '@auth/schemas/otp.schema';
import { Model } from 'mongoose';
import { addMinutes } from 'date-fns';
import { randomInt } from 'node:crypto';
import { OTP_ACTION } from '@auth/enums/otp-action.enum';
import { VerifyOtpInput } from '@auth/dto/verify-otp.input';

@Injectable()
export class AuthService {
  constructor(
    // TODO If the Model dependency increase in the service, create a new service for handling database operations
    @InjectModel(Otp.name)
    private readonly otpModel: Model<Otp>,
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
      sub: _id,
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
      sub: _id,
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
      sub: user._id,
    };

    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(jwtPayload);


    return {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    };
  }

  async sendOtp(sendOtpInput: SendOtpInput) {
    const { action, email } = sendOtpInput;

    const userFound = await this.usersService.findOneByEmail(email);

    if (!userFound) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isOtpActionCodeAlreadySent = await this.otpModel.findOne({
      user: userFound._id,
      action: action,
    });

    if (isOtpActionCodeAlreadySent) {
      const currentTime = new Date();
      const otpExpirationTime = isOtpActionCodeAlreadySent.expiresAt;

      if (currentTime < otpExpirationTime) {
        this.loggerService.debug(
          `OTP already sent to user ${userFound.email} for action ${action}. Code: ${isOtpActionCodeAlreadySent.code}, Expires at: ${otpExpirationTime}`
        );

        throw new UnauthorizedException(
          `OTP already sent to user for action ${action}. Please wait until it expires or request a new OTP.`,
        );
      } else {
        this.loggerService.debug(
          `OTP expired for user ${userFound.email} for action ${action}. Sending new OTP.`
        );

        throw new UnauthorizedException(
          `OTP expired for user ${userFound.email} for action ${action}. Please request a new OTP.`,
        );
      }
    }

    const otpExpireAt = addMinutes(new Date(), Number(envs.OTP_EXPIRATION_MINUTES));
    const otpCode = this.generateNumericOtp(6);

    await this.otpModel.create({
      user: userFound._id,
      action: action,
      expiresAt: otpExpireAt,
      code: otpCode,
    });

    this.loggerService.debug(
      `OTP sent to user ${userFound.email} for action ${action}. Code: ${otpCode}, Expires at: ${otpExpireAt}`
    );

    return true;
  }

  async verifyOtp(verifyOtpInput: VerifyOtpInput) {
    const { email, otp, action, password } = verifyOtpInput;

    const user = await this.usersService.findOneByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const otpDoc = await this.otpModel.findOne({
      user: user._id,
      code: otp,
      action,
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.otpModel.deleteOne({ _id: otpDoc._id });

    switch (action) {
      case OTP_ACTION.RESET_PASSWORD:
        if (!password) {
          throw new BadRequestException('Password is required for reset');
        }

        await this.usersService.updatePassword({
          id: user._id,
          password: password,
        });

        break;
      case OTP_ACTION.CONFIRM_EMAIL:
        await this.usersService.verifyEmail(user._id);
        break;
      case OTP_ACTION.DELETE_ACCOUNT:
        await this.usersService.deleteUser(user._id);
        break;
      default:
        throw new InternalServerErrorException('Unknown OTP action');
    }

    // TODO: Send email notification about OTP verification
    return true;
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

  private generateNumericOtp(length = 6): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += randomInt(0, 10).toString();
    }
    return otp;
  }
}