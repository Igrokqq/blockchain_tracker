import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
class KafkaConfig {
  constructor(private readonly configService: ConfigService) {}

  get clientId(): string {
    return 'eth-sync-service';
    return this.configService.get('KAFKA_CLIENT_ID');
  }

  get brokers(): string[] {
    return ['localhost:9092'];

    const string = this.configService.get('KAFKA_BROKERS');

    return string.split(',');
  }

  get consumerGroupId(): string {
    return this.configService.getOrThrow('KAFKA_CONSUMER_GROUP_ID')
  }
}

export default KafkaConfig;
