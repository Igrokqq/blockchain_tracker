import { Global, Module } from '@nestjs/common';
import ApiConfigModule from '../config/api-config.module';
import { PrismaModule } from './prisma/prisma.module';
import { KafkaModule } from './kafka/kafka.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import HasherModule from './hasher/hasher.module';

@Global()
@Module({
  imports: [
    ApiConfigModule,
    PrismaModule,
    KafkaModule,
    HasherModule,
    RedisModule,
    AuthModule,
  ],
  providers: [

  ],
})
export class CommonModule {}
