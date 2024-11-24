import { Injectable, Logger, LogLevel, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

export type ClearDatabaseParams = {
  exceptTables: string[];
};

@Injectable()
export class PrismaService
  extends PrismaClient<any, LogLevel>
  implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();

  }
}
