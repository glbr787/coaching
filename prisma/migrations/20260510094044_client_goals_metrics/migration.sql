/*
  Warnings:

  - Added the required column `category` to the `ClientGoal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ClientMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "weight" REAL,
    "waist" REAL,
    "chest" REAL,
    "hips" REAL,
    "arm" REAL,
    "thigh" REAL,
    "bodyFatPercentage" REAL,
    "restingHeartRate" INTEGER,
    "energyLevel" INTEGER,
    "sleepQuality" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClientMetric_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClientGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 2,
    "startDate" DATETIME,
    "targetDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "archivedAt" DATETIME,
    "metrics" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClientGoal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ClientGoal" ("clientId", "createdAt", "description", "id", "metrics", "name", "notes", "priority", "startDate", "status", "targetDate", "updatedAt") SELECT "clientId", "createdAt", "description", "id", "metrics", "name", "notes", "priority", "startDate", "status", "targetDate", "updatedAt" FROM "ClientGoal";
DROP TABLE "ClientGoal";
ALTER TABLE "new_ClientGoal" RENAME TO "ClientGoal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
