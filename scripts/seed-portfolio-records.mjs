import { readFile } from "node:fs/promises";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed portfolio records.");
}

const sql = postgres(databaseUrl, {
  max: 1,
  prepare: false,
  ssl: databaseUrl.includes("localhost") ? false : "require",
});

try {
  const seedSql = await readFile(
    new URL("../db/seed-portfolio-records.sql", import.meta.url),
    "utf8",
  );
  const statements = seedSql
    .split(/\n(?=WITH experience_seed\()/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  await sql`set statement_timeout = 0`;

  for (const statement of statements) {
    await sql.unsafe(statement);
  }

  console.log("Projects and experiences seeded with Supabase media references.");
} finally {
  await sql.end();
}
