import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Transaction, TransactionStatus, Wallet } from '@prisma/client';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import Web3 from 'web3';
import WalletService from '../wallet/wallet.service';

@Injectable()
export class EthereumService {
  private web3: Web3;
  private logger = new Logger(EthereumService.name)

  constructor(private prisma: PrismaService, private walletService: WalletService) {
    this.web3 = new Web3('https://rpc.ankr.com/eth');
  }

  async getTransactionStatus(txHash: string): Promise<TransactionStatus> {
    const receipt = await this.web3.eth.getTransactionReceipt(txHash);

    if (!receipt) {
      return TransactionStatus.Pending;
    }

    if (receipt.status) {
      return TransactionStatus.Success;
    } else {
      return TransactionStatus.Failed;
    }
  }

  async updateTransactionStatus(txHash: string) {
    const receipt = await this.web3.eth.getTransactionReceipt(txHash);
    if (receipt) {
      const status = receipt.status ? 'Success' : 'Failed';

      await this.prisma.transaction.update({
        where: { hash: txHash },
        data: { status },
      });

      console.log(`Transaction status ${txHash} updated: ${status}`);
    } else {
      console.log(`Transaction ${txHash} still not confirmed.`);
    }
  }


  async syncWallet(wallet: Wallet): Promise<void> {
    try {
      // const currentBlock = BigInt(await this.web3.eth.getBlockNumber());

      // const fromBlock = currentBlock - BigInt(100);
      const fromBlock = BigInt(wallet.lastBlockNumber || 0);
      const toBlock = fromBlock + BigInt(100);
      let lastSyncedBlockNumber = fromBlock;
      const transactions: Prisma.TransactionUncheckedCreateInput[] = [];

      console.log('BEFORE LOOP')
      for (let blockNumber = fromBlock; blockNumber <= toBlock; blockNumber++) {
        lastSyncedBlockNumber = blockNumber;
        const block = await this.web3.eth.getBlock(blockNumber.toString(), true);

        for (const transaction of block.transactions) {
          const isTransactionPresentedAsString = typeof transaction === 'string';

          if (isTransactionPresentedAsString) {
            this.logger.warn('TRANSACTIONS PRESENTED AS STRINGS INSTEAD OF OBJECT VIEW');
            return;
          }

          const isWalletTransaction = (
            transaction.to?.toLowerCase() === wallet.address.toLowerCase()
            || transaction.from?.toLowerCase() === wallet.address.toLowerCase()
          );

          if (isWalletTransaction) {
            transactions.push({
              hash: transaction.hash,
              fromAddress: transaction.from,
              toAddress: transaction.to,
              blockNumber: blockNumber.toString(),
              status: await this.getTransactionStatus(transaction.hash),
              value: this.web3.utils.fromWei(transaction.value, 'ether'),
              timestamp: block.timestamp.toLocaleString(),
              walletId: wallet.id,
              // timestamp: new Date(block.timestamp * 1000).toLocaleString(), 
            });
          }
        }
      }
      const transactionHashes = transactions.map(tx => tx.hash);
      const existingTransactions = await this.prisma.transaction.findMany({
        where: {
          hash: { in: transactionHashes },
        },
        select: { hash: true },
      });
      const existingHashes = new Set(existingTransactions.map(tx => tx.hash));
      const newTransactions = transactions.filter(tx => !existingHashes.has(tx.hash));

      console.log('TX COUNT TO CREATE', newTransactions.length)

      await this.prisma.transaction.createMany({
        data: newTransactions,
      });
      console.log("UPDATE LAST BLOCK", lastSyncedBlockNumber.toString(), wallet.address)
      await this.walletService.updateLastSyncedBlockNumber(wallet.address, lastSyncedBlockNumber.toString())
    } catch (error) {
      console.error('Error while fetching transaction:', error);
    }
  }
}
