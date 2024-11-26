-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM (
  'Pending',
  'Success',
  'Failed',
  'Dropped',
  'Replaced',
  'Cancelled',
  'Unconfirmed'
);
-- CreateTable
CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "firstName" TEXT,
  "lastName" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "transactions" (
  "id" TEXT NOT NULL,
  "hash" TEXT NOT NULL,
  "fromAddress" TEXT NOT NULL,
  "toAddress" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "timestamp" TEXT NOT NULL,
  "blockNumber" TEXT NOT NULL,
  "status" "TransactionStatus" NOT NULL DEFAULT 'Pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "walletId" TEXT,
  CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "wallets" (
  "id" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "last_block_number" TEXT,
  CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
-- CreateIndex
CREATE UNIQUE INDEX "transactions_hash_key" ON "transactions"("hash");
-- CreateIndex
CREATE UNIQUE INDEX "wallets_address_key" ON "wallets"("address");
-- AddForeignKey
ALTER TABLE "transactions"
ADD CONSTRAINT "transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
