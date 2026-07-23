import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let client: ReturnType<typeof postgres> | undefined;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required before using the database.");
  }

  client ??= postgres(databaseUrl, {
    max: 1,
    ssl: process.env.NODE_ENV === "production" ? "require" : false,
  });

  return drizzle(client, { schema });
}
