import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { ValidateTokenUseCase, JwtPayload } from '@/application/use-cases/auth/validate-token.use-case';
import { UserResponseDto } from '@/application/dtos/auth/auth-response.dto';

/**
 * JWT Strategy
 *
 * Passport strategy for validating JWT tokens.
 * Extracts token from Authorization header and validates it.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  /**
   * Validates the JWT payload and returns user data
   * This is called automatically by Passport after token verification
   */
  async validate(payload: JwtPayload): Promise<UserResponseDto> {
    return this.validateTokenUseCase.validateUser(payload);
  }
}
