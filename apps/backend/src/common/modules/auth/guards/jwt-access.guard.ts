import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import AuthConfig from 'src/common/config/auth';
import { IS_PUBLIC_KEY } from 'src/common/constants';
import { IS_OFF_JWT_ACCESS } from 'src/common/decorators/off-jwt-access.decorator';

@Injectable()
export default class JwtAccessGuard extends AuthGuard('accessToken') {
  private logger = new Logger(JwtAccessGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly authConfig: AuthConfig,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const handlers = [context.getHandler(), context.getClass()];
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      handlers,
    );
    const isOffJwtAccessGuard = this.reflector.getAllAndOverride(
      IS_OFF_JWT_ACCESS,
      handlers,
    );

    if (isPublic || isOffJwtAccessGuard) return true;

    const request = context.switchToHttp().getRequest();

    try {
      const token = this.getToken(request);

      request.user = this.jwtService.verify(token, {
        secret: this.authConfig.accessSecret,
      });

      return true;
    } catch (e) {
      this.logger.error(e);
      throw new UnauthorizedException();
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
