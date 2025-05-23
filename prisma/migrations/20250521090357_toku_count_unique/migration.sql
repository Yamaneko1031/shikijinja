/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `TokuCount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TokuCount_userId_date_key" ON "TokuCount"("userId", "date");
