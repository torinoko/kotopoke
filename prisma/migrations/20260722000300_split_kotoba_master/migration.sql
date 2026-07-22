-- CreateTable
CREATE TABLE "Kotoba" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "defaultReading" TEXT,
    "defaultMeaning" TEXT
);

-- CreateTable
CREATE TABLE "UserKotoba" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kotobaId" TEXT NOT NULL,
    "userId" TEXT,
    "reading" TEXT,
    "meaning" TEXT,
    "source" TEXT,
    "impression" TEXT,
    "collectedAt" TEXT NOT NULL,
    CONSTRAINT "UserKotoba_kotobaId_fkey" FOREIGN KEY ("kotobaId") REFERENCES "Kotoba" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserKotoba_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Migrate distinct word texts into the shared kotoba master.
INSERT INTO "Kotoba" ("id", "text", "defaultReading", "defaultMeaning")
SELECT
    lower(hex(randomblob(16))),
    "text",
    max("reading"),
    max("meaning")
FROM "Word"
GROUP BY "text";

-- Keep existing Word IDs as UserKotoba IDs so current /kotoba/[id] URLs remain valid.
INSERT INTO "UserKotoba" ("id", "kotobaId", "userId", "reading", "meaning", "source", "impression", "collectedAt")
SELECT
    "Word"."id",
    "Kotoba"."id",
    "Word"."userId",
    "Word"."reading",
    "Word"."meaning",
    "Word"."source",
    "Word"."impression",
    "Word"."collectedAt"
FROM "Word"
JOIN "Kotoba" ON "Kotoba"."text" = "Word"."text";

-- CreateIndex
CREATE UNIQUE INDEX "Kotoba_text_key" ON "Kotoba"("text");

-- CreateIndex
CREATE UNIQUE INDEX "UserKotoba_userId_kotobaId_key" ON "UserKotoba"("userId", "kotobaId");

-- CreateIndex
CREATE INDEX "UserKotoba_kotobaId_idx" ON "UserKotoba"("kotobaId");

-- DropTable
DROP TABLE "Word";
