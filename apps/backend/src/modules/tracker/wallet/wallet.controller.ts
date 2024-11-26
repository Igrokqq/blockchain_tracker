import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import WalletService from "./wallet.service";
import GetWalletsDto from "./dto/get-wallets.dto";
import JwtAccessGuard from "src/common/modules/auth/guards/jwt-access.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { UserTokenObject } from "src/common/interfaces";

@UseGuards(JwtAccessGuard)
@Controller('wallets')
export default class WalletController {
  constructor(private service: WalletService) {}

  @Get()
  async getWallets(@CurrentUser() user: UserTokenObject, @Query() dto: GetWalletsDto) {
    return this.service.getUserWallets(user.id, dto)
  }
}
