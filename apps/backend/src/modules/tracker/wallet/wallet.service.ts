import { Injectable } from "@nestjs/common";
import { Wallet } from "@prisma/client";
import { PrismaService } from "src/common/modules/prisma/prisma.service";

@Injectable()
export default class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async createWallet(address: string) {
    await this.prisma.wallet.upsert({
      where: { address },
      create: { address, active: true },
      update: { active: true },
    });
  }

  async untrackAddress(address: string) {
    await this.prisma.wallet.delete({
      where: { address },
    });
  }

  async enableTracking(address: string) {
    await this.prisma.wallet.update({
      where: { address },
      data: { active: true },
    });
  }

  async disableTracking(address: string) {
    await this.prisma.wallet.update({
      where: { address },
      data: { active: false },
    });
  }

  async getwalletes(): Promise<string[]> {
    const addresses = await this.prisma.wallet.findMany({
      where: { active: true },
    });
    return addresses.map((record) => record.address);
  }

  async getWalletByAddress(address: string): Promise<Wallet> {
    const walletOrNull = await this.prisma.wallet.findFirst({ where: { address } })

    return walletOrNull
  }

  async updateLastSyncedBlockNumber(address: string, blockNumber: string) {
    return this.prisma.wallet.update({ where: { address }, data: { lastBlockNumber: blockNumber } })
  }
}
