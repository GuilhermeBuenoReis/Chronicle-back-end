CREATE TABLE "tags" (
	"notes_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_notes_id_notes_id_fk" FOREIGN KEY ("notes_id") REFERENCES "public"."notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" DROP COLUMN "tags";