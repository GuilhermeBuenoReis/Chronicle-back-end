DROP TABLE "notes_tags" CASCADE;--> statement-breakpoint
DROP TABLE "tags" CASCADE;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "tags" text;