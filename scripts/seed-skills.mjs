import { readFile } from "node:fs/promises";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed skills.");
}

const sql = postgres(databaseUrl, {
  max: 1,
  prepare: false,
  ssl: databaseUrl.includes("localhost") ? false : "require",
});

try {
  const seedSql = await readFile(new URL("../db/seed-skills.sql", import.meta.url), "utf8");

  await sql.unsafe(seedSql);
  console.log("Skills table seeded with Supabase bucket object keys.");
} finally {
  await sql.end();
}
