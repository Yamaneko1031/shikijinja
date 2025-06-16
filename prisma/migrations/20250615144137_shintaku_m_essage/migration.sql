-- CreateTable
CREATE TABLE "ShintakuMessage" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isReply" BOOLEAN NOT NULL DEFAULT false,
    "imageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShintakuMessage_pkey" PRIMARY KEY ("id")
);
