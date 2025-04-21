-- CreateTable
CREATE TABLE "EmaPost" (
    "id" TEXT NOT NULL,
    "texts" JSONB NOT NULL,
    "reply" TEXT NOT NULL,
    "emaImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmaPost_pkey" PRIMARY KEY ("id")
);
