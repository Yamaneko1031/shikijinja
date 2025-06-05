/*
  Warnings:

  - You are about to drop the column `name` on the `Omamori` table. All the data in the column will be lost.
  - Added the required column `baseId` to the `Omamori` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Omamori` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GuestSession" DROP CONSTRAINT "GuestSession_userId_fkey";

-- AlterTable
ALTER TABLE "Omamori" DROP COLUMN "name",
ADD COLUMN     "baseId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "OmamoriBase" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hurigana" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "effects" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OmamoriBase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmaPost_userId_idx" ON "EmaPost"("userId");

-- CreateIndex
CREATE INDEX "Omamori_userId_idx" ON "Omamori"("userId");

-- CreateIndex
CREATE INDEX "Omamori_baseId_idx" ON "Omamori"("baseId");

-- CreateIndex
CREATE INDEX "OmikujiResult_userId_idx" ON "OmikujiResult"("userId");

-- AddForeignKey
ALTER TABLE "Omamori" ADD CONSTRAINT "Omamori_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "OmamoriBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestSession" ADD CONSTRAINT "GuestSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
