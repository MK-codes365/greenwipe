-- CreateTable
CREATE TABLE "Stats" (
    "id" TEXT NOT NULL DEFAULT 'stats',
    "totalWipes" INTEGER NOT NULL,
    "pdfDownloads" INTEGER NOT NULL,
    "eWasteDiverted" DOUBLE PRECISION NOT NULL,
    "co2Saved" DOUBLE PRECISION NOT NULL,
    "energySaved" DOUBLE PRECISION NOT NULL,
    "treesSaved" INTEGER NOT NULL,
    "lastCertificateId" TEXT NOT NULL,
    "wipeMethodDistribution" JSONB NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);
