/*
  Warnings:

  - You are about to drop the column `description` on the `Omamori` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Omamori` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Omamori` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Omamori" DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "price";
