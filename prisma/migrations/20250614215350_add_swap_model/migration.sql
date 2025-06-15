-- CreateTable
CREATE TABLE "UpdateUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "name" TEXT,
    "phoneNumber" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "offerSkills" TEXT[],
    "wantSkills" TEXT[],
    "website" TEXT,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpdateUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreateSwapDto" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreateSwapDto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UpdateUser_email_key" ON "UpdateUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CreateSwapDto_id_key" ON "CreateSwapDto"("id");
