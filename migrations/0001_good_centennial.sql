CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"post_id" integer NOT NULL,
	"content" text NOT NULL,
	"comment_active_status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipments" (
	"id" serial PRIMARY KEY NOT NULL,
	"equipment_type" text NOT NULL,
	"brand_name" text,
	"model_name" text
);
--> statement-breakpoint
CREATE TABLE "music_genres" (
	"id" serial PRIMARY KEY NOT NULL,
	"genre_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "music_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"skill_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "musical_influences" (
	"id" serial PRIMARY KEY NOT NULL,
	"artist_name" text NOT NULL,
	"release_name" text NOT NULL,
	"release_year" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"post_active_status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"address" text,
	"birthdate" date,
	"bio" text,
	"contact_link" text
);
--> statement-breakpoint
CREATE TABLE "searched_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"skill_id" integer NOT NULL,
	"genre_id" integer
);
--> statement-breakpoint
CREATE TABLE "user_equipments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"equipment_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_favorite_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"post_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_musical_influences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"influence_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"skill_id" integer NOT NULL,
	"genre_id" integer
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "searched_skills" ADD CONSTRAINT "searched_skills_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "searched_skills" ADD CONSTRAINT "searched_skills_skill_id_music_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."music_skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "searched_skills" ADD CONSTRAINT "searched_skills_genre_id_music_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."music_genres"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_equipments" ADD CONSTRAINT "user_equipments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_equipments" ADD CONSTRAINT "user_equipments_equipment_id_equipments_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorite_posts" ADD CONSTRAINT "user_favorite_posts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorite_posts" ADD CONSTRAINT "user_favorite_posts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_musical_influences" ADD CONSTRAINT "user_musical_influences_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_musical_influences" ADD CONSTRAINT "user_musical_influences_influence_id_musical_influences_id_fk" FOREIGN KEY ("influence_id") REFERENCES "public"."musical_influences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_skill_id_music_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."music_skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_genre_id_music_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."music_genres"("id") ON DELETE cascade ON UPDATE no action;