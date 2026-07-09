-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Word" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "reading" TEXT,
    "source" TEXT,
    "meaning" TEXT,
    "impression" TEXT,
    "relatedWords" TEXT NOT NULL,
    "collectedAt" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Word_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Word" ("collectedAt", "id", "impression", "meaning", "reading", "relatedWords", "source", "text") SELECT "collectedAt", "id", "impression", "meaning", "reading", "relatedWords", "source", "text" FROM "Word";
DROP TABLE "Word";
ALTER TABLE "new_Word" RENAME TO "Word";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
