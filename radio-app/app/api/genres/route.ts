import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const genres = await prisma.genre.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { songs: true } } },
  });

  return NextResponse.json(genres);
}
