import { Module } from "@nestjs/common";
import { EthereumService } from "./ethereum.service";
import { EthereumController } from "./ethereum.controller";
import WalletModule from "../wallet/wallet.module";

@Module({
  imports: [WalletModule],
  providers: [EthereumService],
  controllers: [EthereumController],
  exports: [EthereumService],
})
export default class EthereumModule {}
