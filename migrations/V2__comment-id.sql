ALTER TABLE "comment" ADD COLUMN "uuid" uuid NOT NULL DEFAULT uuid_generate_v4 ();
