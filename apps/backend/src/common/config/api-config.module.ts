import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import PostgresConfig from './postgres';
import ServerConfig from './server';
import KafkaConfig from './kafka';
import AuthConfig from './auth';
import RedisConfig from './redis';
import HasherConfig from './hasher';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ expandVariables: true })],
  providers: [
    ServerConfig,
    PostgresConfig,
    KafkaConfig,
    AuthConfig,
    RedisConfig,
    HasherConfig
  ],
  exports: [
    ServerConfig,
    PostgresConfig,
    KafkaConfig,
    AuthConfig,
    RedisConfig,
    HasherConfig
  ],
})
export default class ApiConfigModule implements OnModuleInit {
  constructor(
    private serverConfig: ServerConfig,
    private postgresConfig: PostgresConfig,
    private kafkaConfig: KafkaConfig,
    private authConfig: AuthConfig,
    private redisConfig: RedisConfig,
    private hasherConfig: HasherConfig
  ) {}

  private validateConfig(config: any): void {
    const prototype = Object.getPrototypeOf(config);
    const gettersKeys: string[] = [];

    Object.getOwnPropertyNames(prototype).forEach((name) => {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
      if (descriptor && typeof descriptor.get === 'function') {
        gettersKeys.push(name);
      }
    });

    for (const getterKey of gettersKeys) {
      config[getterKey];
    }
  }

  onModuleInit() {
    this.validateConfig(this.serverConfig);
    this.validateConfig(this.postgresConfig);
    this.validateConfig(this.kafkaConfig)
    this.validateConfig(this.authConfig)
    this.validateConfig(this.redisConfig)
    this.validateConfig(this.hasherConfig)
  }
}
