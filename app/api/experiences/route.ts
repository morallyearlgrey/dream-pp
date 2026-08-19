import { NextResponse } from "next/server";
import { getExperiencesFromDb, getPortfolioDbErrorMessage } from "@/lib/portfolio-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const experiences = await getExperiencesFromDb();

    return NextResponse.json({ experiences });
  } catch (error) {
    return NextResponse.json(
      { error: getPortfolioDbErrorMessage(error), experiences: [] },
      { status: 503 },
    );
  }
}
