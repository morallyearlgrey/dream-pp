ALTER TABLE "endorsements"
  DROP CONSTRAINT IF EXISTS "endorsements_experience_id_experiences_id_fk";

ALTER TABLE "endorsements"
  ALTER COLUMN "experience_id" TYPE text USING "experience_id"::text;

CREATE INDEX IF NOT EXISTS "endorsements_experience_id_idx"
  ON "endorsements" ("experience_id");

CREATE INDEX IF NOT EXISTS "endorsements_approved_idx"
  ON "endorsements" ("approved");

CREATE INDEX IF NOT EXISTS "endorsements_featured_idx"
  ON "endorsements" ("featured");

CREATE INDEX IF NOT EXISTS "endorsements_created_at_idx"
  ON "endorsements" ("created_at");
