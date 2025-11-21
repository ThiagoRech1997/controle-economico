import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import { PrismaUserRepository } from '@/infrastructure/persistence/prisma/repositories/prisma-user.repository';
import { PrismaModule } from '@/infrastructure/persistence/prisma/prisma.module';

import { RegisterUserUseCase } from '@/application/use-cases/auth/register-user.use-case';
import { LoginUserUseCase } from '@/application/use-cases/auth/login-user.use-case';
import { ValidateTokenUseCase } from '@/application/use-cases/auth/validate-token.use-case';
import { RefreshTokenUseCase } from '@/application/use-cases/auth/refresh-token.use-case';

import { AuthController } from '@/infrastructure/http/controllers/auth.controller';
import { JwtStrategy } from '@/infrastructure/http/strategies/jwt.strategy';
import { JwtAuthGuard } from '@/infrastructure/http/guards/jwt-auth.guard';

/**
 * Auth Module
 *
 * Configures authentication with:
 * - JWT token generation and validation
 * - Passport strategies
 * - Repository implementations
 * - Use cases
 * - Controllers
 */
@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION', '1h') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Repository
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },

    // Use Cases
    RegisterUserUseCase,
    LoginUserUseCase,
    ValidateTokenUseCase,
    RefreshTokenUseCase,

    // Strategies & Guards
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [
    USER_REPOSITORY,
    JwtAuthGuard,
    ValidateTokenUseCase,
    PassportModule,
    JwtModule,
  ],
})
export class AuthModule {}
