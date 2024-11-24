import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './kafka-producer.service';
import { KafkaConsumerService } from './kafka-consumer.service';
import KafkaConfig from 'src/common/config/kafka';
import { Partitioners } from '@nestjs/microservices/external/kafka.interface';

export const KAFKA_CLIENT_NAME = 'KAFKA';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'testtestkafka',
        inject: [KafkaConfig],
        useFactory: async (kafkaConfig: KafkaConfig) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: kafkaConfig.clientId,
                brokers: kafkaConfig.brokers,  // Например, ['localhost:9092']
              },
              consumer: {
                groupId: kafkaConfig.consumerGroupId,
                allowAutoTopicCreation: true
              },
            },
          }
        }
      },
    ]),
  ],
  providers: [KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}
