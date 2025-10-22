-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemSize" TEXT NOT NULL,
    "wipeMethod" TEXT NOT NULL,
    "wipeCompletionDate" TIMESTAMP(3) NOT NULL,
    "verificationMethod" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "reportJson" TEXT NOT NULL,
    "anchored" BOOLEAN NOT NULL,
    "transactionId" TEXT NOT NULL,
    "auditTrail" JSONB NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);
