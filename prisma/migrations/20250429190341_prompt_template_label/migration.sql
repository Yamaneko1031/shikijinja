/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `PromptTemplate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PromptTemplate_label_key" ON "PromptTemplate"("label");
