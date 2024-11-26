
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './modules/app/app.module';
import ServerConfig from './common/config/server';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import KafkaConfig from './common/config/kafka';

async function bootstrap() {
  const logger = new Logger('src/main.ts');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const kafkaConfig = app.get(KafkaConfig)

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: kafkaConfig.clientId,
        brokers: kafkaConfig.brokers,
      },
      consumer: {
        groupId: kafkaConfig.consumerGroupId,
        allowAutoTopicCreation: true
      },
    },
  });

  await app.startAllMicroservices();

  const serverConfig = app.get(ServerConfig);

  await app.listen(serverConfig.port, () => {
    logger.log(`Started on port: ${serverConfig.port}`);
  });
}
bootstrap();
