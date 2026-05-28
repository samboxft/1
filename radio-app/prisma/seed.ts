import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const BASE_URL = "/music";

const seedData = {
  Lofi: [
    { title: "Midnight Cafe", artist: "Chillhop Music", audioUrl: `${BASE_URL}/lofi-01.mp3` },
    { title: "Study Session", artist: "Lo-Fi Beats", audioUrl: `${BASE_URL}/lofi-02.mp3` },
    { title: "Rainy Window", artist: "Ambient Works", audioUrl: `${BASE_URL}/lofi-03.mp3` },
    { title: "Late Night Thoughts", artist: "Dreamy Beats", audioUrl: `${BASE_URL}/lofi-04.mp3` },
    { title: "Coffee Shop Vibes", artist: "Urban Sounds", audioUrl: `${BASE_URL}/lofi-05.mp3` },
    { title: "Soft Focus", artist: "Mellow Waves", audioUrl: `${BASE_URL}/lofi-06.mp3` },
    { title: "Tokyo Drift", artist: "City Lofi", audioUrl: `${BASE_URL}/lofi-07.mp3` },
    { title: "Slow Mornings", artist: "Calm Studio", audioUrl: `${BASE_URL}/lofi-08.mp3` },
  ],
  Jazz: [
    { title: "Blue Note Evening", artist: "Miles Quartet", audioUrl: `${BASE_URL}/jazz-01.mp3` },
    { title: "Autumn Serenade", artist: "The Cool Cats", audioUrl: `${BASE_URL}/jazz-02.mp3` },
    { title: "Smoky Room", artist: "Club Six", audioUrl: `${BASE_URL}/jazz-03.mp3` },
    { title: "After Midnight", artist: "Jazz Collective", audioUrl: `${BASE_URL}/jazz-04.mp3` },
    { title: "Spring Rain", artist: "The Trio", audioUrl: `${BASE_URL}/jazz-05.mp3` },
    { title: "Bossa Nova Walk", artist: "Rio Ensemble", audioUrl: `${BASE_URL}/jazz-06.mp3` },
    { title: "Harlem Nights", artist: "Big Band Groove", audioUrl: `${BASE_URL}/jazz-07.mp3` },
    { title: "Moonlight Sonata Jazz", artist: "Piano Keys", audioUrl: `${BASE_URL}/jazz-08.mp3` },
  ],
  Electronic: [
    { title: "Neon Pulse", artist: "Synth Wave", audioUrl: `${BASE_URL}/electronic-01.mp3` },
    { title: "Circuit Dreams", artist: "Digital Echo", audioUrl: `${BASE_URL}/electronic-02.mp3` },
    { title: "Hyperspace", artist: "Future Beats", audioUrl: `${BASE_URL}/electronic-03.mp3` },
    { title: "Midnight Protocol", artist: "Machine Code", audioUrl: `${BASE_URL}/electronic-04.mp3` },
    { title: "Electric Garden", artist: "The Algorithm", audioUrl: `${BASE_URL}/electronic-05.mp3` },
    { title: "Binary Sunset", artist: "Zero One", audioUrl: `${BASE_URL}/electronic-06.mp3` },
    { title: "Rave Culture", artist: "Bass Station", audioUrl: `${BASE_URL}/electronic-07.mp3` },
    { title: "Deep Frequency", artist: "Subsonic", audioUrl: `${BASE_URL}/electronic-08.mp3` },
  ],
};

async function main() {
  console.log("Seeding database...");

  for (const [genreName, songs] of Object.entries(seedData)) {
    const genre = await prisma.genre.upsert({
      where: { name: genreName },
      update: {},
      create: { name: genreName },
    });

    for (const song of songs) {
      await prisma.song.upsert({
        where: {
          title_artist: { title: song.title, artist: song.artist },
        },
        update: { audioUrl: song.audioUrl },
        create: {
          title: song.title,
          artist: song.artist,
          audioUrl: song.audioUrl,
          genreId: genre.id,
        },
      });
    }

    console.log(`  ✓ Seeded ${songs.length} songs for genre: ${genreName}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
