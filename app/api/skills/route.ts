import { NextResponse } from "next/server";
import { getPortfolioDbErrorMessage, getSkillsFromDb } from "@/lib/portfolio-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const skills = await getSkillsFromDb();

    return NextResponse.json({ skills });
  } catch (error) {
    return NextResponse.json(
      { error: getPortfolioDbErrorMessage(error), skills: [] },
      { status: 503 },
    );
  }
}
