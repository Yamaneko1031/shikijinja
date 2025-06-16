-- CreateTable
CREATE TABLE "ShintakuMessageMaster" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "imageKey" TEXT NOT NULL,

    CONSTRAINT "ShintakuMessageMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemInfomations" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "shintakuData" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemInfomations_pkey" PRIMARY KEY ("id")
);
