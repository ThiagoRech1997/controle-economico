import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User } from '@/domain/entities/user.entity';
import {
  UserRepository,
  USER_REPOSITORY,
} from '@/domain/repositories/user.repository.interface';
import { RegisterUserDto } from '@/application/dtos/auth/register-user.dto';
import { AuthResponseDto, UserResponseDto } from '@/application/dtos/auth/auth-response.dto';

/**
 * Register User Use Case
 *
 * Handles user registration with:
 * - Email uniqueness validation
 * - Password hashing
 * - JWT token generation
 */
@Injectable()
export class RegisterUserUseCase {
  private readonly saltRounds = 10;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: RegisterUserDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);

    // Create user entity
    const user = User.create({
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    // Persist user
    const savedUser = await this.userRepository.create(user);

    // Generate tokens
    const tokens = await this.generateTokens(savedUser);

    // Return response
    return {
      ...tokens,
      user: this.mapToUserResponse(savedUser),
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
