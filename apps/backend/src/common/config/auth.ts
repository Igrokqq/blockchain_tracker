import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
class AuthConfig {
  constructor(private configService: ConfigService) {}

  get jwtAccessExpire(): string {
    return this.configService.get('JWT_ACCESS_EXPIRE', '3d');
  }

  get jwtRefreshExpire(): string {
    return this.configService.get('JWT_REFRESH_EXPIRE', '3d');
  }

  get refreshSecret(): string {
    return this.configService.getOrThrow('JWT_REFRESH_SECRET');
  }

  get accessSecret(): string {
    return this.configService.getOrThrow('JWT_ACCESS_SECRET');
  }

}

export default AuthConfig;
