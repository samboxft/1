import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

/**
 * SoundHelix provides 16 royalty-free orchestral/electronic tracks at predictable
 * URLs (https://www.soundhelix.com/examples/mp3/SoundHelix-Song-N.mp3).
 * We route them through /api/proxy so the Web Audio API (same-origin requirement)
 * works for the visualizer.
 */
function proxyUrl(externalUrl: string) {
  return `/api/proxy?url=${encodeURIComponent(externalUrl)}`;
}

function soundHelix(n: number) {
  return proxyUrl(
    `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`
  );
}

const seedData = {
  Lofi: [
    { title: "Midnight Reverie",    artist: "T. Schürger",  audioUrl: soundHelix(1)  },
    { title: "Rainy Window",        artist: "T. Schürger",  audioUrl: soundHelix(2)  },
    { title: "Soft Focus",          artist: "T. Schürger",  audioUrl: soundHelix(3)  },
    { title: "Late Night Thoughts", artist: "T. Schürger",  audioUrl: soundHelix(4)  },
    { title: "Coffee Shop Haze",    artist: "T. Schürger",  audioUrl: soundHelix(5)  },
    { title: "Slow Mornings",       artist: "T. Schürger",  audioUrl: soundHelix(6)  },
    { title: "Study Session",       artist: "T. Schürger",  audioUrl: soundHelix(7)  },
    { title: "Tokyo Drift",         artist: "T. Schürger",  audioUrl: soundHelix(8)  },
  ],
  Jazz: [
    { title: "Blue Note Evening",   artist: "T. Schürger",  audioUrl: soundHelix(9)  },
    { title: "Autumn Serenade",     artist: "T. Schürger",  audioUrl: soundHelix(10) },
    { title: "Smoky Room",          artist: "T. Schürger",  audioUrl: soundHelix(11) },
    { title: "After Midnight",      artist: "T. Schürger",  audioUrl: soundHelix(12) },
    { title: "Spring Rain",         artist: "T. Schürger",  audioUrl: soundHelix(13) },
    { title: "Bossa Nova Walk",     artist: "T. Schürger",  audioUrl: soundHelix(14) },
    { title: "Harlem Nights",       artist: "T. Schürger",  audioUrl: soundHelix(15) },
    { title: "Moonlight Groove",    artist: "T. Schürger",  audioUrl: soundHelix(16) },
  ],
  Electronic: [
    { title: "Neon Pulse",          artist: "T. Schürger",  audioUrl: soundHelix(1)  },
    { title: "Circuit Dreams",      artist: "T. Schürger",  audioUrl: soundHelix(3)  },
    { title: "Hyperspace",          artist: "T. Schürger",  audioUrl: soundHelix(5)  },
    { title: "Midnight Protocol",   artist: "T. Schürger",  audioUrl: soundHelix(7)  },
    { title: "Electric Garden",     artist: "T. Schürger",  audioUrl: soundHelix(9)  },
    { title: "Binary Sunset",       artist: "T. Schürger",  audioUrl: soundHelix(11) },
    { title: "Rave Culture",        artist: "T. Schürger",  audioUrl: soundHelix(13) },
    { title: "Deep Frequency",      artist: "T. Schürger",  audioUrl: soundHelix(15) },
  ],
};

async function main() {
  console.log("Seeding database with real music tracks...");

  // Wipe and recreate so URLs are always fresh
  await prisma.newsCache.deleteMany();
  await prisma.song.deleteMany();
  await prisma.genre.deleteMany();

  for (const [genreName, songs] of Object.entries(seedData)) {
    const genre = await prisma.genre.create({ data: { name: genreName } });

    await prisma.song.createMany({
      data: songs.map((s) => ({
        title: s.title,
        artist: s.artist,
        audioUrl: s.audioUrl,
        genreId: genre.id,
      })),
    });

    console.log(`  ✓ ${genreName}: ${songs.length} real tracks`);
  }

  console.log("Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
