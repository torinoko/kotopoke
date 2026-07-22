PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_UserKotoba" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kotobaId" TEXT NOT NULL,
    "senseId" TEXT,
    "userId" TEXT,
    "reading" TEXT,
    "meaning" TEXT,
    "source" TEXT,
    "impression" TEXT,
    "collectedAt" TEXT NOT NULL,
    CONSTRAINT "UserKotoba_kotobaId_fkey" FOREIGN KEY ("kotobaId") REFERENCES "Kotoba" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserKotoba_senseId_fkey" FOREIGN KEY ("senseId") REFERENCES "KotobaSense" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "UserKotoba_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO "new_UserKotoba" (
    "id",
    "kotobaId",
    "senseId",
    "userId",
    "reading",
    "meaning",
    "source",
    "impression",
    "collectedAt"
)
SELECT
    "UserKotoba"."id",
    "UserKotoba"."kotobaId",
    (
        SELECT "KotobaSense"."id"
        FROM "KotobaSense"
        WHERE "KotobaSense"."kotobaId" = "UserKotoba"."kotobaId"
          AND "KotobaSense"."reading" = "UserKotoba"."reading"
        LIMIT 1
    ),
    "UserKotoba"."userId",
    "UserKotoba"."reading",
    "UserKotoba"."meaning",
    "UserKotoba"."source",
    "UserKotoba"."impression",
    "UserKotoba"."collectedAt"
FROM "UserKotoba";

DROP TABLE "UserKotoba";
ALTER TABLE "new_UserKotoba" RENAME TO "UserKotoba";

CREATE INDEX "UserKotoba_kotobaId_idx" ON "UserKotoba"("kotobaId");
CREATE INDEX "UserKotoba_senseId_idx" ON "UserKotoba"("senseId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
