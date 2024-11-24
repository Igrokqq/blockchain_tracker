import { Global, Module } from '@nestjs/common';
import ApiConfigModule from '../config/api-config.module';
import { PrismaModule } from './prisma/prisma.module';
import { KafkaModule } from './kafka/kafka.module';

@Global()
@Module({
  imports: [
    ApiConfigModule,
    PrismaModule,
    KafkaModule
  ],
  providers: [

  ],
})
export class CommonModule {}
