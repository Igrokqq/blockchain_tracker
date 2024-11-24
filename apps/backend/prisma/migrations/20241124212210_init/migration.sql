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
-- function
CREATE OR REPLACE FUNCTION update_last_block_number() RETURNS TRIGGER AS $$ BEGIN
UPDATE wallets
SET last_block_number = (
    SELECT MAX(block_number::BIGINT)::TEXT -- Преобразуем строку в BIGINT для MAX и обратно в строку
    FROM transactions
    WHERE transactions.wallet_id = NEW.wallet_id
  )
WHERE id = NEW.wallet_id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- trigger
CREATE TRIGGER update_last_block_number_trigger
AFTER
INSERT
  OR
UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_last_block_number();
