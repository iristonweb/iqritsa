CREATE TABLE "anti_cheat_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"session_id" text NOT NULL,
	"suspicion_score" integer DEFAULT 0 NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iq_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"player_name" text DEFAULT 'IQPlayer' NOT NULL,
	"profile_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "iq_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "leaderboard" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"player_name" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"stage" integer DEFAULT 0 NOT NULL,
	"total_solved" integer DEFAULT 0 NOT NULL,
	"accuracy" real DEFAULT 0 NOT NULL,
	"avg_time" real DEFAULT 0 NOT NULL,
	"country" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pvp_matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" text NOT NULL,
	"winner_user_id" text,
	"player_a_user_id" text NOT NULL,
	"player_b_user_id" text NOT NULL,
	"score_a" integer DEFAULT 0 NOT NULL,
	"score_b" integer DEFAULT 0 NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"finished_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pvp_matches_match_id_unique" UNIQUE("match_id")
);
--> statement-breakpoint
CREATE TABLE "race_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"race_id" text NOT NULL,
	"player_name" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"solved" integer DEFAULT 0 NOT NULL,
	"total_questions" integer DEFAULT 0 NOT NULL,
	"time_ms" integer DEFAULT 0 NOT NULL,
	"stage" integer DEFAULT 0 NOT NULL,
	"finished_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
