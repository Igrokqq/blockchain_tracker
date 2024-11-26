// src/transactions/transactions.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import TransactionService from './transaction.service';
import GetTransactionsDto from './dto/get-transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private service: TransactionService) {}

  @Get()
  async getTransactions(
    @Query() dto: GetTransactionsDto
  ) {
    return this.service.getTransactions(dto);
  }
}
