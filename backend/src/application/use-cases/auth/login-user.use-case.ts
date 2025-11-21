import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { User } from '@/domain/entities/user.entity';
import {
  UserRepository,
  USER_REPOSITORY,
} from '@/domain/repositories/user.repository.interface';
import { LoginDto } from '@/application/dtos/auth/login.dto';
import { AuthResponseDto, UserResponseDto } from '@/application/dtos/auth/auth-response.dto';

/**
 * Login User Use Case
 *
 * Handles user authentication with:
 * - Email/password validation
 * - JWT token generation
 */
@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    // Find user by email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.getPasswordHash(),
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Return response
    return {
      ...tokens,
      user: this.mapToUserResponse(user),
    };
  }

  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  }> {
    const payload = {
      sub: user.getId(),
      email: user.getEmailValue(),
      name: user.getName(),
    };

    const accessTokenExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRATION',
      '1h',
    );
    const refreshTokenExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRATION',
      '7d',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: accessTokenExpiresIn as any,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: refreshTokenExpiresIn as any,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.parseExpiration(accessTokenExpiresIn),
    };
  }

  private parseExpiration(expiration: string): number {
    // Convert "1h", "7d" to seconds
    const unit = expiration.slice(-1);
    const value = parseInt(expiration.slice(0, -1), 10);

    switch (unit) {
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      case 'm':
        return value * 60;
      case 's':
        return value;
      default:
        return 3600; // Default 1 hour
    }
  }

  private mapToUserResponse(user: User): UserResponseDto {
    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmailValue(),
      createdAt: user.getCreatedAt(),
    };
  }
}
