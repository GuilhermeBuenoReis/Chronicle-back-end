ALTER TABLE "tasks" DROP CONSTRAINT "tasks_note_id_notes_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "note_id";