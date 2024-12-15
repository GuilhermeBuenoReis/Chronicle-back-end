CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"avatar_url" text NOT NULL,
	"exeternal_acount_id" integer NOT NULL,
	CONSTRAINT "users_exeternal_acount_id_unique" UNIQUE("exeternal_acount_id")
);
