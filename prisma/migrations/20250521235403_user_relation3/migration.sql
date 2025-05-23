-- DropForeignKey
ALTER TABLE "OmikujiResult" DROP CONSTRAINT "OmikujiResult_userId_fkey";

-- AlterTable
ALTER TABLE "OmikujiResult" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "OmikujiResult" ADD CONSTRAINT "OmikujiResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
