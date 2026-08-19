import { NextResponse } from "next/server";
import { getPortfolioDbErrorMessage, getPublishedBlogsFromDb } from "@/lib/portfolio-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const blogs = await getPublishedBlogsFromDb();

    return NextResponse.json({ blogs });
  } catch (error) {
    return NextResponse.json(
      { blogs: [], error: getPortfolioDbErrorMessage(error) },
      { status: 503 },
    );
  }
}
