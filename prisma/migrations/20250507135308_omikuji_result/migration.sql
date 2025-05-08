-- CreateTable
CREATE TABLE "OmikujiResult" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "fortune" TEXT NOT NULL,
    "msg" TEXT NOT NULL,
    "details" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OmikujiResult_pkey" PRIMARY KEY ("id")
);
