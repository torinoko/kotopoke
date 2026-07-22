-- CreateTable
CREATE TABLE "KotobaSense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kotobaId" TEXT NOT NULL,
    "reading" TEXT NOT NULL,
    CONSTRAINT "KotobaSense_kotobaId_fkey" FOREIGN KEY ("kotobaId") REFERENCES "Kotoba" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Seed senses from the shared kotoba defaults.
INSERT INTO "KotobaSense" ("id", "kotobaId", "reading")
SELECT
    lower(hex(randomblob(16))),
    "id",
    "defaultReading"
FROM "Kotoba"
WHERE "defaultReading" IS NOT NULL
  AND trim("defaultReading") <> '';

-- Seed senses from user records. This preserves readings users have corrected manually.
INSERT INTO "KotobaSense" ("id", "kotobaId", "reading")
SELECT
    lower(hex(randomblob(16))),
    "UserKotoba"."kotobaId",
    "UserKotoba"."reading"
FROM "UserKotoba"
WHERE "UserKotoba"."reading" IS NOT NULL
  AND trim("UserKotoba"."reading") <> ''
  AND NOT EXISTS (
      SELECT 1
      FROM "KotobaSense"
      WHERE "KotobaSense"."kotobaId" = "UserKotoba"."kotobaId"
        AND "KotobaSense"."reading" = "UserKotoba"."reading"
  );

-- CreateIndex
CREATE UNIQUE INDEX "KotobaSense_kotobaId_reading_key" ON "KotobaSense"("kotobaId", "reading");

-- CreateIndex
CREATE INDEX "KotobaSense_kotobaId_idx" ON "KotobaSense"("kotobaId");
