import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type ParsedURL = Readonly<{
  host: string;
  port: number;
  password: string;
}>;

@Injectable()
class RedisConfig {
  constructor(private configService: ConfigService) {}

  get url(): string {
    return this.configService.getOrThrow('REDIS_URL');
  }

  get host(): string {
    return this.configService.getOrThrow('REDIS_HOST');
  }

  get port(): number {
    return Number(this.configService.getOrThrow('REDIS_PORT'));
  }

  get db(): number {
    return Number(this.configService.get('REDIS_DB') || 0);
  }

  get password(): string {
    return this.configService.getOrThrow('REDIS_PASSWORD');
  }

  get parsedUrl(): ParsedURL {
    return {
      host: this.host,
      port: Number(this.port),
      password: this.password,
    };
  }

  get ttlInSeconds(): number {
    return this.configService.get('REDIS_TTL_IN_SECONDS', 15);
  }

  get redisRefreshExpirationTime(): number {
    return this.configService.getOrThrow('REDIS_JWT_REFRESH_EXPIRATION');
  }
}

export default RedisConfig;
