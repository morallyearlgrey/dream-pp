import { and, count, eq, ne } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { endorsements } from "@/db/schema";
import { authOptions } from "@/lib/auth";

type PatchPayload = {
  approved?: unknown;
  featured?: unknown;
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  let payload: PatchPayload;

  try {
    payload = (await request.json()) as PatchPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const updates: {
    approved?: boolean;
    featured?: boolean;
  } = {};

  if (typeof payload.approved === "boolean") {
    updates.approved = payload.approved;

    if (!payload.approved) {
      updates.featured = false;
    }
  }

  if (typeof payload.featured === "boolean") {
    updates.featured = payload.featured;

    if (payload.featured) {
      updates.approved = true;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No supported fields to update." }, { status: 400 });
  }

  try {
    const db = getDb();
    const [target] = await db
      .select()
      .from(endorsements)
      .where(eq(endorsements.id, id))
      .limit(1);

    if (!target) {
      return NextResponse.json({ error: "Endorsement not found." }, { status: 404 });
    }

    if (updates.featured) {
      const [featuredCount] = await db
        .select({ value: count() })
        .from(endorsements)
        .where(
          and(
            eq(endorsements.experienceId, target.experienceId),
            eq(endorsements.featured, true),
            ne(endorsements.id, id),
          ),
        );

      if ((featuredCount?.value ?? 0) >= 3) {
        return NextResponse.json(
          { error: "Only three endorsements can be featured for this experience." },
          { status: 400 },
        );
      }
    }

    const [updated] = await db
      .update(endorsements)
      .set(updates)
      .where(eq(endorsements.id, id))
      .returning();

    return NextResponse.json({ endorsement: updated });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("DATABASE_URL")
        ? "Dashboard moderation requires DATABASE_URL to be configured."
        : "Endorsement could not be updated.";

    return NextResponse.json({ error: message }, { status: 503 });
  }
}
