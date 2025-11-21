import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  UserRepository,
  USER_REPOSITORY,
} from '@/domain/repositories/user.repository.interface';
import { UserResponseDto } from '@/application/dtos/auth/auth-response.dto';
import { User } from '@/domain/entities/user.entity';

/**
 * JWT Payload structure
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

/**
 * Validate Token Use Case
 *
 * Validates JWT token and returns user data
 */
@Injectable()
export class ValidateTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string): Promise<UserResponseDto> {
    try {
      // Verify and decode token
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      // Find user in database
      const user = await this.userRepository.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.mapToUserResponse(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Validates user from JWT payload (used by Passport strategy)
   */
  async validateUser(payload: JwtPayload): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.mapToUserResponse(user);
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
