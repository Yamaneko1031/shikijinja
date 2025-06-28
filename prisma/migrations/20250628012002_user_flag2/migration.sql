/*
  Warnings:

  - You are about to drop the `ActionFlag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActionFlag" DROP CONSTRAINT "ActionFlag_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "actionFlags" JSONB NOT NULL DEFAULT '{}';

-- DropTable
DROP TABLE "ActionFlag";
