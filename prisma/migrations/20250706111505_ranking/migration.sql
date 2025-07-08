-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DEFAULT '';

-- CreateTable
CREATE TABLE "PettingLog" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "pettingCount" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PettingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankingCache" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "rankingType" TEXT NOT NULL,
    "yearMonth" TEXT,
    "rank" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "pettingCount" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RankingCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PettingLog_userId_createdAt_idx" ON "PettingLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "RankingCache_rankingType_yearMonth_rank_idx" ON "RankingCache"("rankingType", "yearMonth", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "RankingCache_userId_rankingType_yearMonth_key" ON "RankingCache"("userId", "rankingType", "yearMonth");

-- AddForeignKey
ALTER TABLE "PettingLog" ADD CONSTRAINT "PettingLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingCache" ADD CONSTRAINT "RankingCache_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
