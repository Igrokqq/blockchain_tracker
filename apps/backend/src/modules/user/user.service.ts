import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/common/modules/prisma/prisma.service";

@Injectable()
export default class UserService {
  constructor(private prisma: PrismaService) {}


  getUserById(id: string): Promise<User> {
    return this.prisma.user.findFirst({ where: { id } })
  }
}
