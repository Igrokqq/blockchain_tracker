// kafka-producer.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { KAFKA_CLIENT_NAME } from './kafka.module';
import { TRACK_WALLET_TASK } from './kafka.constants';

@Injectable()
export class KafkaProducerService {

  constructor(@Inject('testtestkafka') private readonly kafkaClient: ClientKafka) {}

  async sendMessage(topic: string, message: any) {
    await this.kafkaClient.emit(topic, { value: message });
    console.log(`Сообщение отправлено в топик ${topic}:`, message);
  }

  async sendTrackWalletTask(address: string): Promise<void> {
    await this.kafkaClient.emit(TRACK_WALLET_TASK, { address })
  }
}
