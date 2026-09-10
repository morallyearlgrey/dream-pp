ALTER TABLE "endorsements"
  DROP CONSTRAINT IF EXISTS "endorsements_note_length_check";

ALTER TABLE "endorsements"
  ADD CONSTRAINT "endorsements_note_length_check"
  CHECK (char_length(btrim("note")) BETWEEN 1 AND 500);
