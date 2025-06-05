/*
  Warnings:

  - Added the required column `imageUrl` to the `OmamoriBase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OmamoriBase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OmamoriBase" ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;
