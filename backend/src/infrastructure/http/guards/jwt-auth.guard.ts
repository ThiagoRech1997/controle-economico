import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

/**
 * JWT Authentication Guard
 *
 * Protects routes by requiring valid JWT token.
 * Use @UseGuards(JwtAuthGuard) on controllers/routes.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add custom logic here if needed (e.g., check for public routes)
    return super.canActivate(context);
  }
}
