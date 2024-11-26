import { Module } from "@nestjs/common";
import TransactionService from "./transaction.service";
import { TransactionsController } from "./transaction.controller";

@Module({
  controllers: [TransactionsController],
  providers: [TransactionService],
  exports: [TransactionService]
})
export default class TransactionModule {}
