/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Otp2` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Otp2_id_key" ON "Otp2"("id");
