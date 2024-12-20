import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

enum NODE_ENV {
  DEV = 'development',
  PROD = 'production',
}
export enum LOG_LEVEL {
  SILENT = 'silent',
}

@Injectable()
class ServerConfig {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get('PORT', 4000);
  }

  get isDev(): boolean {
    return this.configService.get('NODE_ENV', NODE_ENV.DEV) === NODE_ENV.DEV;
  }

  get isProd(): boolean {
    return this.configService.get('NODE_ENV', NODE_ENV.PROD) === NODE_ENV.PROD;
  }
}

export default ServerConfig;
