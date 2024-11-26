import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { RedisService as LibRedisService } from '@songkeys/nestjs-redis';
import { Redis } from 'ioredis';
import RedisConfig from 'src/common/config/redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redisClient: Redis;

  constructor(
    private readonly redisService: LibRedisService,
    private readonly redisConfig: RedisConfig,
  ) {}

  onModuleInit() {
    this.redisClient = this.redisService.getClient();
  }

  async cacheItem(key: string, data: string, ttl?: number): Promise<void> {
    await this.redisClient.set(
      key,
      data,
      'EX',
      ttl ?? this.redisConfig.ttlInSeconds,
    );
  }

  async getCachedItem(key: string): Promise<unknown | null> {
    const value = await this.redisClient.get(key);

    return value || null;
  }

  async getUserRefreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<string[]> {
    const result = await this.redisClient.get(`${userId}_${refreshToken}`);

    return JSON.parse(result ?? '[]');
  }

  async addUserRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<string[]> {
    const key = `${userId}_${refreshToken}`;
    const refreshTokens: string[] = JSON.parse(
      (await this.redisClient.get(key)) ?? '[]',
    );
    refreshTokens.push(refreshToken);

    await this.redisClient.set(
      key,
      JSON.stringify(refreshTokens),
      'EX',
      this.redisConfig.redisRefreshExpirationTime,
    );

    return refreshTokens;
  }

  async removeUserRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<string[]> {
    const key = `${userId}_${refreshToken}`;
    const refreshTokens: string[] = JSON.parse(
      (await this.redisClient.get(key)) ?? '[]',
    ).filter((token) => token !== refreshToken);

    await this.redisClient.set(
      key,
      JSON.stringify(refreshTokens),
      'EX',
      this.redisConfig.redisRefreshExpirationTime,
    );

    return refreshTokens;
  }

  async clearUserRefreshTokens(userId: string): Promise<void> {
    await this.redisClient.del(`${userId}_*`);
  }

  async flushall() {
    return await this.redisClient.flushall();
  }

  async close() {
    return this.redisClient.quit();
  }
}
