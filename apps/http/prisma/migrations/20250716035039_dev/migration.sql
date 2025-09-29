/*
  Warnings:

  - You are about to alter the column `amount` on the `Subscription` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_userId_fkey";

-- DropIndex
DROP INDEX "File_deleted_idx";

-- DropIndex
DROP INDEX "File_paid_idx";

-- DropIndex
DROP INDEX "File_userId_idx";

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "active" SET DEFAULT false,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "File_userId_deleted_idx" ON "File"("userId", "deleted");

-- CreateIndex
CREATE INDEX "File_userId_paid_idx" ON "File"("userId", "paid");

-- CreateIndex
CREATE INDEX "User_pubKey_idx" ON "User"("pubKey");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
