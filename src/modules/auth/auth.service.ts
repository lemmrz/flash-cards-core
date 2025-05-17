import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload, JwtResponse } from './auth.constants';
import { UserService } from '../user/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, User } from '@prisma/client'
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { envVars } from 'src/common/constants/env-variables.mapping';
import { UserResponse } from './entities/user-response.entity';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  private jwtConstants: {
    accessSecret: string;
    refreshSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
    refreshExpiresInDays: number;
  };
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {
    this.jwtConstants = {
      accessSecret:
        this.configService.get<string>(envVars.jwt.accessSecret) || '',
      refreshSecret:
        this.configService.get<string>(envVars.jwt.refreshSecret) || '',
      expiresIn: this.configService.get<string>(envVars.jwt.expiresIn) || '',
      refreshExpiresIn:
        this.configService.get<string>(envVars.jwt.refreshExpiresIn) || '',
      refreshExpiresInDays:
        this.configService.get<number>(envVars.jwt.refreshExpiresInDays) || 0,
    };
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    const passwordValid = await bcrypt.compare(pass, user.password);
    if (passwordValid) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<JwtResponse> {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtConstants.accessSecret,
      expiresIn: this.jwtConstants.expiresIn,
    });

    const refreshTokenRaw = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(envVars.jwt.refreshSecret),
      expiresIn: this.configService.get<string>(envVars.jwt.refreshExpiresIn),
    });

    const hashedRefresh = await bcrypt.hash(refreshTokenRaw, 10);
    const expires = new Date();
    expires.setDate(expires.getDate() + this.jwtConstants.refreshExpiresInDays);

    await this.prismaService.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    await this.prismaService.refreshToken.create({
      data: {
        token: hashedRefresh,
        expiresAt: expires,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenRaw,
    };
  }

  async register(dto: CreateUserDto): Promise<UserResponse> {
    const { email, password, name } = dto;
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async refresh(userId: number, token: string): Promise<JwtResponse> {
    const refreshToken = await this.prismaService.refreshToken.findUnique({
      where: { userId },
    });

    if (!refreshToken) {
      const msg = `Refresh token for user ${userId} was not found`;
      throw new NotFoundException(msg);
    }

    const isValid = await bcrypt.compare(token, refreshToken.token);
    if (isValid && refreshToken.expiresAt > new Date()) {
      const payload = { sub: userId };

      // Generate a new access token
      const newAccessToken = this.jwtService.sign(payload, {
        secret: this.jwtConstants.accessSecret,
        expiresIn: this.jwtConstants.expiresIn,
      });

      // Generate a new refresh token
      const newRefreshTokenRaw = this.jwtService.sign(payload, {
        secret: this.jwtConstants.refreshSecret,
        expiresIn: this.jwtConstants.refreshExpiresIn,
      });

      const newHashedRefreshToken = await bcrypt.hash(newRefreshTokenRaw, 10);
      const newExpires = new Date();
      newExpires.setDate(
        newExpires.getDate() + this.jwtConstants.refreshExpiresInDays,
      );

      // Update the refresh token in the database
      await this.prismaService.refreshToken.update({
        where: { userId },
        data: {
          token: newHashedRefreshToken,
          expiresAt: newExpires,
        },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshTokenRaw,
      };
    }

    // If the token is invalid or expired, delete it
    await this.prismaService.refreshToken.delete({
      where: { userId },
    });

    throw new ConflictException('Refresh token expired or invalid');
  }

  async logout(userId: number): Promise<Prisma.BatchPayload> {
    return this.prismaService.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
