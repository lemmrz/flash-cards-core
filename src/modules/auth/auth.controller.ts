import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RefreshDto } from './dto/refresh.dto';
import { RequestWithUser } from 'src/common/types/common.types';
import { JwtResponse } from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { UserResponse } from './entities/user-response.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'User registration payload',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({
    description: 'User login payload',
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: JwtResponse,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<JwtResponse> {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({
    description: 'Refresh token payload',
    type: RefreshDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed',
    type: JwtResponse,
  })
  @ApiResponse({ status: 409, description: 'Invalid or expired refresh token' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(
    @Request() req: RequestWithUser,
    @Body() body: RefreshDto,
  ): Promise<JwtResponse> {
    const userId = req.user.userId;
    return this.authService.refresh(userId, body.refreshToken);
  }

  @ApiOperation({ summary: 'Log out a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: RequestWithUser): Promise<{ message: string }> {
    const userId = req.user.userId;
    await this.authService.logout(userId);
    return { message: 'Logged out' };
  }
}
