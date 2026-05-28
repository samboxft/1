import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const songsByGenre = {
  Lofi: [
    ["Rainy Window Loop", "Cursor Session Band", "/audio/lofi-rainy-window-loop.wav"],
    ["Late Night Notebook", "Soft Syntax", "/audio/lofi-late-night-notebook.wav"],
    ["Cafe Refactor", "Null Island Beats", "/audio/lofi-cafe-refactor.wav"],
    ["Warm Cache", "The Async Keys", "/audio/lofi-warm-cache.wav"],
  ],
  Jazz: [
    ["Blue Terminal", "Migrations Quartet", "/audio/jazz-blue-terminal.wav"],
    ["Schema Swing", "The Index Trio", "/audio/jazz-schema-swing.wav"],
    ["Midnight Compile", "Ella Byte", "/audio/jazz-midnight-compile.wav"],
    ["Rollback Rag", "Foreign Key Five", "/audio/jazz-rollback-rag.wav"],
  ],
  Electronic: [
    ["Neon Packet", "Port 443", "/audio/electronic-neon-packet.wav"],
    ["Circuit Bloom", "Voltage Garden", "/audio/electronic-circuit-bloom.wav"],
    ["Cloud Runner", "Instance Zero", "/audio/electronic-cloud-runner.wav"],
    ["Pulse Width", "Binary Sunrise", "/audio/electronic-pulse-width.wav"],
  ],
} satisfies Record<string, [string, string, string][]>;

async function main() {
  for (const [genreName, songs] of Object.entries(songsByGenre)) {
    const genre = await prisma.genre.upsert({
      where: { name: genreName },
      update: {},
      create: { name: genreName },
    });

    for (const [title, artist, audioUrl] of songs) {
      await prisma.song.upsert({
        where: {
          title_artist: {
            title,
            artist,
          },
        },
        update: {
          audioUrl,
          genreId: genre.id,
        },
        create: {
          title,
          artist,
          audioUrl,
          genreId: genre.id,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
