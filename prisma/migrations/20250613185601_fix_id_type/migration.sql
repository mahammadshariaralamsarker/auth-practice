/*
  Warnings:

  - The primary key for the `Otp2` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Otp2" DROP CONSTRAINT "Otp2_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Otp2_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Otp2_id_seq";
