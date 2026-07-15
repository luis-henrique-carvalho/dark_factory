CREATE TABLE "distribution_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"brand_id" text NOT NULL,
	"slug" text NOT NULL,
	"platform" text NOT NULL,
	"content_format" text NOT NULL,
	"resolution_width" integer NOT NULL,
	"resolution_height" integer NOT NULL,
	"aspect_ratio" text NOT NULL,
	"min_duration_seconds" integer NOT NULL,
	"max_duration_seconds" integer NOT NULL,
	"target_duration_seconds" integer NOT NULL,
	"timezone" text NOT NULL,
	"default_title_template" text,
	"default_description_template" text,
	"default_tags_json" jsonb NOT NULL,
	"default_hashtags_json" jsonb NOT NULL,
	"default_posting_times_json" jsonb NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "distribution_profile" ADD CONSTRAINT "distribution_profile_brand_id_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "distribution_profile_brandId_idx" ON "distribution_profile" USING btree ("brand_id");--> statement-breakpoint
CREATE UNIQUE INDEX "distribution_profile_brandId_slug_idx" ON "distribution_profile" USING btree ("brand_id","slug");