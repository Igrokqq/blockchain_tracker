
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

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe())

  // Настройка Kafka как микросервиса
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: kafkaConfig.clientId, // Идентификатор клиента
        brokers: kafkaConfig.brokers, // Параметры брокера
      },
      consumer: {
        groupId: kafkaConfig.consumerGroupId, // Группа потребителей
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
