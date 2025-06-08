/*
  Warnings:

  - Added the required column `type` to the `OmikujiResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OmikujiResult" ADD COLUMN     "type" TEXT NOT NULL;
