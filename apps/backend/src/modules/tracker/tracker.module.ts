import { Module } from "@nestjs/common";
import EthereumModule from "./ethereum/ethereum.module";
import TrackedAddressModule from "./wallet/wallet.module";
import { TrackerController } from "./tracker.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import KafkaConfig from "src/common/config/kafka";
import TransactionModule from "./transaction/transaction.module";

@Module({
  imports: [
    TrackedAddressModule,
    EthereumModule,
    TransactionModule
  ],
  controllers: [TrackerController]
})
export default class TrackerModule {}
