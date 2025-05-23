/*
  Warnings:

  - Added the required column `userId` to the `EmaPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `OmikujiResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmaPost" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OmikujiResult" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TokuCount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "counts" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "TokuCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "isGuest" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "passwordHash" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastAccessAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_isGuest_lastAccessAt_idx" ON "User"("isGuest", "lastAccessAt");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerUserId_key" ON "Account"("provider", "providerUserId");

-- AddForeignKey
ALTER TABLE "EmaPost" ADD CONSTRAINT "EmaPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OmikujiResult" ADD CONSTRAINT "OmikujiResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
