import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let client: ReturnType<typeof postgres> | undefined;

export function getDb() {
  const databaseUrl =
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim();

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL or a supported POSTGRES_URL variable is required before using the database.",
    );
  }

  client ??= postgres(databaseUrl, {
    connect_timeout: 10,
    idle_timeout: 20,
    max: 4,
    prepare: false,
    ssl: "require",
  });

  return drizzle(client, { schema });
}
