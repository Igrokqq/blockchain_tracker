import { Controller, Get, Param } from '@nestjs/common';
import { EthereumService } from './ethereum.service';

@Controller('ethereum')
export class EthereumController {
  constructor(private readonly ethereumService: EthereumService) {}

  // @Get('transactions/:address')
  // async getTransactions(@Param('address') address: string) {
  //   return this.ethereumService.getTransactions(address);
  // }
}
