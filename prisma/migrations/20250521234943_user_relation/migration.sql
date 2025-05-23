-- DropForeignKey
ALTER TABLE "EmaPost" DROP CONSTRAINT "EmaPost_userId_fkey";

-- DropForeignKey
ALTER TABLE "OmikujiResult" DROP CONSTRAINT "OmikujiResult_userId_fkey";

-- AddForeignKey
ALTER TABLE "EmaPost" ADD CONSTRAINT "EmaPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OmikujiResult" ADD CONSTRAINT "OmikujiResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
