import { Global, Module } from '@nestjs/common';
import { RedisModule as LibRedisModule } from '@songkeys/nestjs-redis';
import RedisConfig from 'src/common/config/redis';

import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    LibRedisModule.forRootAsync({
      useFactory: (redisConfig: RedisConfig) => ({
        config: {
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password,
          db: redisConfig.db,
        },
      }),
      inject: [RedisConfig],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
