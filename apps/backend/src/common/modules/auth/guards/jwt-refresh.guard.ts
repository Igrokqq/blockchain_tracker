import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { RedisService } from '../../redis/redis.service';
import AuthConfig from 'src/common/config/auth';
import { IS_PUBLIC_KEY } from 'src/common/constants';

@Injectable()
export default class JwtRefreshGuard extends AuthGuard('refreshToken') {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly authConfig: AuthConfig,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    try {
      const token = this.getToken(request);

      request.user = this.jwtService.verify(token, {
        secret: this.authConfig.refreshSecret,
      });
      const refreshTokens = await this.redisService.getUserRefreshTokens(
        request.user.id,
        token,
      );

      if (!refreshTokens.includes(token)) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  protected getToken(request: {
    headers: Record<string, string | string[]>;
  }): string {
    const authorization = request.headers['authorization'];

    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, token] = authorization.split(' ');
    return token;
  }
}
