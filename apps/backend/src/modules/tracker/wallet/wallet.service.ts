import { Injectable } from "@nestjs/common";
import { Wallet } from "@prisma/client";
import { PrismaService } from "src/common/modules/prisma/prisma.service";
import GetWalletsDto from "./dto/get-wallets.dto";

@Injectable()
export default class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async createWallet(userId: string, address: string) {
    return this.prisma.wallet.upsert({
      where: { address },
      create: {
        address,
        active: true,
        users: {
          connect: { id: userId },
        },
      },
      update: {
        active: true,
        users: {
          connect: { id: userId },
        },
      },
    });
  }

  async untrackAddress(userId: string, walletId: string) {
    return this.prisma.wallet.update({
      where: { id: walletId },
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
    });
  }

  // async enableTracking(address: string) {
  //   await this.prisma.wallet.update({
  //     where: { address },
  //     data: { active: true },
  //   });
  // }

  // async disableTracking(address: string) {
  //   await this.prisma.wallet.update({
  //     where: { address },
  //     data: { active: false },
  //   });
  // }

  async getWallets(dto: GetWalletsDto): Promise<Wallet[]> {
    const wallets = await this.prisma.wallet.findMany({
      where: { active: true },
    });

    return wallets;
  }

  async getUserWallets(userId: string, dto: GetWalletsDto): Promise<Wallet[]> {
    const wallets = await this.prisma.wallet.findMany({
      where: { active: true, users: { some: { id: userId } } },
    });

    return wallets;
  }

  async getWalletByAddress(address: string): Promise<Wallet> {
    const walletOrNull = await this.prisma.wallet.findFirst({ where: { address } })

    return walletOrNull
  }

  async updateLastSyncedBlockNumber(address: string, blockNumber: string) {
    return this.prisma.wallet.update({ where: { address }, data: { lastBlockNumber: blockNumber } })
  }
}
