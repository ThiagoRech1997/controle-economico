import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { RegisterUserDto } from '@/application/dtos/auth/register-user.dto';
import { LoginDto } from '@/application/dtos/auth/login.dto';
import { RefreshTokenDto } from '@/application/dtos/auth/refresh-token.dto';
import {
  AuthResponseDto,
  UserResponseDto,
} from '@/application/dtos/auth/auth-response.dto';
import { RegisterUserUseCase } from '@/application/use-cases/auth/register-user.use-case';
import { LoginUserUseCase } from '@/application/use-cases/auth/login-user.use-case';
import { RefreshTokenUseCase } from '@/application/use-cases/auth/refresh-token.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * Authentication Controller
 *
 * Handles all authentication-related HTTP endpoints:
 * - User registration
 * - User login
 * - Token refresh
 * - Profile retrieval
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register new user',
    description: 'Creates a new user account and returns JWT tokens',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already registered',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async register(@Body() dto: RegisterUserDto): Promise<AuthResponseDto> {
    return this.registerUserUseCase.execute(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates user and returns JWT tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.loginUserUseCase.execute(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generates new access token using valid refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.refreshTokenUseCase.execute(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns authenticated user data',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getProfile(@Request() req: any): Promise<UserResponseDto> {
    return req.user;
  }
}
