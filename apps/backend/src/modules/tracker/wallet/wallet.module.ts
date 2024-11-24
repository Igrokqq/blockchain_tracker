import { Module } from "@nestjs/common";
import WalletService from "./wallet.service";

@Module({
  providers: [WalletService],
  exports: [WalletService]
})
export default class WalletModule {}
