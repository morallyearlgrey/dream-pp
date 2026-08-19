import { NextResponse } from "next/server";
import { getPortfolioDbErrorMessage, getProjectsFromDb } from "@/lib/portfolio-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await getProjectsFromDb();

    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json(
      { error: getPortfolioDbErrorMessage(error), projects: [] },
      { status: 503 },
    );
  }
}
