/*
  Warnings:

  - You are about to drop the `RankingCache` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RankingCache" DROP CONSTRAINT "RankingCache_userId_fkey";

-- DropTable
DROP TABLE "RankingCache";
