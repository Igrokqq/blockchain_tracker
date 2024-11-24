import { Controller, Get, Inject, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import TrackedAddressService from './wallet/wallet.service';
import { KafkaProducerService } from 'src/common/modules/kafka/kafka-producer.service';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaConsumerService } from 'src/common/modules/kafka/kafka-consumer.service';
import { TRACK_WALLET_TASK } from 'src/common/modules/kafka/kafka.constants';
import TrackWalletTaskDto from './dto/track-wallet-task.dto';
import WalletService from './wallet/wallet.service';
import { EthereumService } from './ethereum/ethereum.service';

@Controller('tracker')
export class TrackerController {
  constructor(
    private readonly walletService: WalletService,
    private readonly ethService: EthereumService,
    // @Inject('testtestkafka') private readonly kafkaClient: ClientKafka,
    private readonly kafkaProducerService: KafkaProducerService
  ) {}

  @EventPattern(TRACK_WALLET_TASK)
  async handleTrackWalletTask(@Payload() dto: TrackWalletTaskDto) {
    console.log('Получено сообщение из Kafka:', dto.address);
    // Здесь ваша логика обработки

    const wallet = await this.walletService.getWalletByAddress(dto.address)

    // ignore this task if wallet in case of not existing wallet or his inactiveness.
    if (!wallet || !wallet.active) {
      return;
    }

    await this.ethService.syncWallet(wallet)

    // repeat it until it become active: false
    await this.kafkaProducerService.sendTrackWalletTask(dto.address)
  }

  // Инициализация Kafka клиента
  async onModuleInit() {
    // await this.kafkaClient.connect();
    // await this.kafkaProducerService.sendTrackWalletTask('0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5')
    await this.kafkaProducerService.sendTrackWalletTask('')
  }


  @Get('address/:address')
  async trackAddress(@Param('address') address: string) {
    await this.walletService.createWallet(address);
    await this.kafkaProducerService.sendTrackWalletTask(address);

    return 'OK';
  }
}
