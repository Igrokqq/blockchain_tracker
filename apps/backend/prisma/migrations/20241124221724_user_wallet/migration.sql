-- CreateTable
CREATE TABLE "_UserToWallet" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToWallet_AB_unique" ON "_UserToWallet"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToWallet_B_index" ON "_UserToWallet"("B");

-- AddForeignKey
ALTER TABLE "_UserToWallet" ADD CONSTRAINT "_UserToWallet_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToWallet" ADD CONSTRAINT "_UserToWallet_B_fkey" FOREIGN KEY ("B") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
