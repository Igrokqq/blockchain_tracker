import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaClient } from '@prisma/client';
import { AppModule } from 'src/modules/app/app.module';
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient();

async function main() {
  const rootHashedPassword = await bcrypt.hash('1234', 10)
  const rootUser = await prisma.user.upsert({
    where: { email: 'root@domain.com' },
    update: {
      password: rootHashedPassword,
    },
    create: {
      email: 'root@domain.com',
      password: rootHashedPassword,
      firstName: 'Root',
      lastName: 'User',
      wallets: {
        create: [

        ],
      },
    },
  });

  console.log('Root user created or already exists:', rootUser);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
