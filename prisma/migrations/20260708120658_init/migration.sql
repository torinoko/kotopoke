-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "reading" TEXT,
    "source" TEXT,
    "meaning" TEXT,
    "impression" TEXT,
    "relatedWords" TEXT NOT NULL,
    "collectedAt" TEXT NOT NULL
);
