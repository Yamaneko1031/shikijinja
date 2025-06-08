/*
  Warnings:

  - You are about to drop the column `type` on the `OmikujiResult` table. All the data in the column will be lost.
  - Added the required column `period` to the `OmikujiResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OmikujiResult" DROP COLUMN "type",
ADD COLUMN     "period" TEXT NOT NULL;
