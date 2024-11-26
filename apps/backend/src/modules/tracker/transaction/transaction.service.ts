import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/modules/prisma/prisma.service";
import GetTransactionsDto from "./dto/get-transactions.dto";
import ListDto from "src/common/dto/list.dto";

@Injectable()
export default class TransactionService {
  constructor(private prisma: PrismaService) {}

  async getTransactions(dto: GetTransactionsDto) {
    const pagination = ListDto.getPagination(dto);

    const transactions = await this.prisma.transaction.findMany({
      where: { wallet: { address: dto.address } },
      skip: pagination.skip,
      take: pagination.take,
      orderBy: {
        timestamp: 'desc',
      },
    });

    const totalCount = await this.prisma.transaction.count({
      where: { wallet: { address: dto.address } },
    });

    return {
      transactions,
      totalCount,
    };
  }
}
