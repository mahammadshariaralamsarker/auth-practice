/*
  Warnings:

  - You are about to drop the `CreateSwapDto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CreateSwapDto";

-- CreateTable
CREATE TABLE "Swap" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Swap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Swap_id_key" ON "Swap"("id");
