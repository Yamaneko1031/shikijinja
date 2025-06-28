/*
  Warnings:

  - You are about to drop the column `actionFlags` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "actionFlags",
ADD COLUMN     "permanentTokuCounts" JSONB NOT NULL DEFAULT '{}';
