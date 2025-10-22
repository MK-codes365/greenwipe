-- CreateTable
CREATE TABLE "WipeEvent" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalWipes" INTEGER NOT NULL,
    "co2Saved" DOUBLE PRECISION NOT NULL,
    "eWasteDiverted" DOUBLE PRECISION NOT NULL,
    "energySaved" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WipeEvent_pkey" PRIMARY KEY ("id")
);
