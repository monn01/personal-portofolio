-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Certification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issueDate" DATETIME NOT NULL,
    "credentialUrl" TEXT,
    "imageUrl" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'local',
    "profileId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Certification_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Certification" ("createdAt", "credentialUrl", "id", "imageUrl", "issueDate", "issuer", "profileId", "title", "updatedAt") SELECT "createdAt", "credentialUrl", "id", "imageUrl", "issueDate", "issuer", "profileId", "title", "updatedAt" FROM "Certification";
DROP TABLE "Certification";
ALTER TABLE "new_Certification" RENAME TO "Certification";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
