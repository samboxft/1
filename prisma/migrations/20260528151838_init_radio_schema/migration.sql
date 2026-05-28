-- CreateTable
CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "lastPlayedAt" DATETIME,
    "genreId" INTEGER NOT NULL,
    CONSTRAINT "Song_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HostIntro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "songId" INTEGER NOT NULL,
    "script" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HostIntro_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE INDEX "Song_genreId_lastPlayedAt_idx" ON "Song"("genreId", "lastPlayedAt");

-- CreateIndex
CREATE UNIQUE INDEX "HostIntro_songId_key" ON "HostIntro"("songId");
