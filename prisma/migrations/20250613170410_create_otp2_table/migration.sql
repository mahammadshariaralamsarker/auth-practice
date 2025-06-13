-- CreateTable
CREATE TABLE "Otp2" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp2_email_code_key" ON "Otp2"("email", "code");
