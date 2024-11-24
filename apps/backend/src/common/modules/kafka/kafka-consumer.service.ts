import { Injectable } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import KafkaConfig from 'src/common/config/kafka';

@Injectable()
export class KafkaConsumerService {
  constructor() {}

  @MessagePattern('sync')
  async testSync(@Payload() payload) {
    console.log('asdasdlsalda', payload);
  }
}

