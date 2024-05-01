-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Registrations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Registrations" ("address", "createdAt", "email", "firstName", "id", "lastName", "phone", "updatedAt", "username") SELECT "address", "createdAt", "email", "firstName", "id", "lastName", "phone", "updatedAt", "username" FROM "Registrations";
DROP TABLE "Registrations";
ALTER TABLE "new_Registrations" RENAME TO "Registrations";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
