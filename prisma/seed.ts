import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run prisma seed.");
}

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

const seedData = {
  Lofi: [
    {
      title: "Rainy Study Session",
      artist: "Lofted Beats",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      title: "Moonlight Coffee",
      artist: "Night Tape",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      title: "Window Seat",
      artist: "Analog Avenue",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
  ],
  Jazz: [
    {
      title: "Late Night Blue",
      artist: "Miles East",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    },
    {
      title: "Copper Street Shuffle",
      artist: "The Fifth Bar",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    },
    {
      title: "Velvet Keys",
      artist: "Aria Monroe Trio",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    },
  ],
  Electronic: [
    {
      title: "Neon Drift",
      artist: "Pulse Unit",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    },
    {
      title: "Afterimage",
      artist: "Modular Coast",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    },
    {
      title: "Orbit City",
      artist: "Skyline Protocol",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    },
  ],
} as const;

async function main() {
  await prisma.hostIntro.deleteMany();
  await prisma.song.deleteMany();
  await prisma.genre.deleteMany();

  for (const [genreName, songs] of Object.entries(seedData)) {
    const genre = await prisma.genre.create({
      data: { name: genreName },
    });

    await prisma.song.createMany({
      data: songs.map((song) => ({
        ...song,
        genreId: genre.id,
      })),
    });
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
