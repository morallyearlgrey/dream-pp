import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { endorsements } from "@/db/schema";

const limits = {
  authorName: 120,
  experienceId: 160,
  note: 500,
};

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseEndorsementPayload(payload);

  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const db = getDb();
    await db.insert(endorsements).values({
      approved: false,
      authorName: parsed.authorName,
      experienceId: parsed.experienceId,
      featured: false,
      note: parsed.note,
    });

    return NextResponse.json({
      message: "Endorsement submitted for review.",
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("DATABASE_URL")
        ? "Endorsements require DATABASE_URL to be configured."
        : "Endorsement could not be saved.";

    return NextResponse.json({ error: message }, { status: 503 });
  }
}

function parseEndorsementPayload(payload: unknown):
  | {
      authorName: string;
      experienceId: string;
      note: string;
    }
  | { error: string } {
  if (!payload || typeof payload !== "object") {
    return { error: "Request body is required." };
  }

  const body = payload as Record<string, unknown>;
  const authorName = normalizeText(body.authorName);
  const experienceId = normalizeText(body.experienceId);
  const note = normalizeText(body.note);

  if (experienceId.length < 1 || experienceId.length > limits.experienceId) {
    return { error: "Experience is required." };
  }

  if (authorName.length < 2 || authorName.length > limits.authorName) {
    return { error: "Name must be between 2 and 120 characters." };
  }

  if (note.length < 1 || note.length > limits.note) {
    return { error: "Endorsement must be between 1 and 500 characters." };
  }

  return { authorName, experienceId, note };
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}
