/*
  Warnings:

  - You are about to drop the column `otp_verify` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "otp_verify";
