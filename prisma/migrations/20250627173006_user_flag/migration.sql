/*
  Warnings:

  - You are about to drop the column `registReward` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SystemInfomations" ADD COLUMN     "totalSaisen" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "registReward",
ADD COLUMN     "effects" JSONB NOT NULL DEFAULT '{}';

-- CreateTable
CREATE TABLE "ActionFlag" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "registReward" BOOLEAN NOT NULL DEFAULT false,
    "decalogueView" BOOLEAN NOT NULL DEFAULT false,
    "deityView" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ActionFlag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActionFlag_userId_key" ON "ActionFlag"("userId");

-- CreateIndex
CREATE INDEX "ActionFlag_userId_idx" ON "ActionFlag"("userId");

-- AddForeignKey
ALTER TABLE "ActionFlag" ADD CONSTRAINT "ActionFlag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
