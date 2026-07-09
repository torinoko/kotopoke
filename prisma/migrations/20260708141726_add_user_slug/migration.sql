-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'ローカルユーザー',
    "displayName" TEXT NOT NULL DEFAULT 'ローカルユーザー',
    "handle" TEXT NOT NULL DEFAULT 'local-user',
    "slug" TEXT NOT NULL DEFAULT 'local-user',
    "recoveryCodeHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "displayName", "handle", "id", "name", "recoveryCodeHash") SELECT "createdAt", "displayName", "handle", "id", "name", "recoveryCodeHash" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");
CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
