/*
  Warnings:

  - You are about to drop the column `effects` on the `Omamori` table. All the data in the column will be lost.
  - You are about to drop the column `effects` on the `OmamoriBase` table. All the data in the column will be lost.
  - You are about to drop the column `effects` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Omamori" DROP COLUMN "effects",
ADD COLUMN     "fortunes" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "OmamoriBase" DROP COLUMN "effects",
ADD COLUMN     "fortunes" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "effects",
ADD COLUMN     "fortunes" JSONB NOT NULL DEFAULT '{}';
