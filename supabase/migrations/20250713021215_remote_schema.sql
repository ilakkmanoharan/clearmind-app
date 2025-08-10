create table "public"."post_stats" (
    "post_id" uuid not null,
    "views" integer default 0,
    "likes" integer default 0,
    "comments" integer default 0
);


create table "public"."posts" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "title" text,
    "content" text,
    "status" text default 'draft'::text,
    "created_at" timestamp with time zone default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone default timezone('utc'::text, now())
);


create table "public"."profiles" (
    "id" uuid not null,
    "username" text,
    "bio" text,
    "avatar_url" text,
    "created_at" timestamp with time zone default timezone('utc'::text, now())
);


CREATE UNIQUE INDEX post_stats_pkey ON public.post_stats USING btree (post_id);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."post_stats" add constraint "post_stats_pkey" PRIMARY KEY using index "post_stats_pkey";

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."post_stats" add constraint "post_stats_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE not valid;

alter table "public"."post_stats" validate constraint "post_stats_post_id_fkey";

alter table "public"."posts" add constraint "posts_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text]))) not valid;

alter table "public"."posts" validate constraint "posts_status_check";

alter table "public"."posts" add constraint "posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."posts" validate constraint "posts_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

grant delete on table "public"."post_stats" to "anon";

grant insert on table "public"."post_stats" to "anon";

grant references on table "public"."post_stats" to "anon";

grant select on table "public"."post_stats" to "anon";

grant trigger on table "public"."post_stats" to "anon";

grant truncate on table "public"."post_stats" to "anon";

grant update on table "public"."post_stats" to "anon";

grant delete on table "public"."post_stats" to "authenticated";

grant insert on table "public"."post_stats" to "authenticated";

grant references on table "public"."post_stats" to "authenticated";

grant select on table "public"."post_stats" to "authenticated";

grant trigger on table "public"."post_stats" to "authenticated";

grant truncate on table "public"."post_stats" to "authenticated";

grant update on table "public"."post_stats" to "authenticated";

grant delete on table "public"."post_stats" to "service_role";

grant insert on table "public"."post_stats" to "service_role";

grant references on table "public"."post_stats" to "service_role";

grant select on table "public"."post_stats" to "service_role";

grant trigger on table "public"."post_stats" to "service_role";

grant truncate on table "public"."post_stats" to "service_role";

grant update on table "public"."post_stats" to "service_role";

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";


