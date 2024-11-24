import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import PostgresConfig from './postgres';
import ServerConfig from './server';
import KafkaConfig from './kafka';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ expandVariables: true })],
  providers: [
    ServerConfig,
    PostgresConfig,
    KafkaConfig,
  ],
  exports: [
    ServerConfig,
    PostgresConfig,
    KafkaConfig,
  ],
})
export default class ApiConfigModule implements OnModuleInit {
  constructor(
    private serverConfig: ServerConfig,
    private postgresConfig: PostgresConfig,
    private kafkaConfig: KafkaConfig
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
  }
}
