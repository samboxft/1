import { NextResponse } from "next/server";
import { generateHourlyNews } from "@/lib/news";

export async function GET() {
  try {
    const news = await generateHourlyNews();
    return NextResponse.json(news);
  } catch (error) {
    console.error("[News API] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate news" },
      { status: 500 }
    );
  }
}
