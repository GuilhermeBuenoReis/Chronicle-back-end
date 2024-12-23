CREATE TABLE "notes_tags" (
	"id" text PRIMARY KEY NOT NULL,
	"notes_id" text NOT NULL,
	"tags_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notes_tags" ADD CONSTRAINT "notes_tags_notes_id_notes_id_fk" FOREIGN KEY ("notes_id") REFERENCES "public"."notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes_tags" ADD CONSTRAINT "notes_tags_tags_id_tags_id_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;