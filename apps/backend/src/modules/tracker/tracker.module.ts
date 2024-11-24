import { Module } from "@nestjs/common";
import EthereumModule from "./ethereum/ethereum.module";
import TrackedAddressModule from "./wallet/wallet.module";
import { TrackerController } from "./tracker.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import KafkaConfig from "src/common/config/kafka";

@Module({
  imports: [
    TrackedAddressModule,
    EthereumModule
  ],
  controllers: [TrackerController]
})
export default class TrackerModule {}
