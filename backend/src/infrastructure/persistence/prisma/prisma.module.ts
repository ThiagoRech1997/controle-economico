import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Prisma Module
 *
 * Global module that provides PrismaService to all other modules.
 * Marked as @Global() so it doesn't need to be imported everywhere.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
