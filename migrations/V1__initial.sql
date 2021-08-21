CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE "feed_item_type" AS ENUM ('TEXT', 'IMAGE');

CREATE TABLE "guild" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logo" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

/* Plural due to "user" being a reserved word */
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "uuid" uuid DEFAULT uuid_generate_v4 (),
    "name" TEXT NOT NULL,
    "team_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

CREATE TABLE "feed_item" (
    "id" SERIAL NOT NULL,
    "uuid" uuid DEFAULT uuid_generate_v4 (),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "image" TEXT,
    "text" TEXT,
    "type" "feed_item_type" NOT NULL,
    "action_id" INTEGER NOT NULL,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "is_sticky" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

CREATE TABLE "action_type" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "cooldown" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_user_action" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("id")
);

CREATE TABLE "action" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "action_type_id" INTEGER NOT NULL,
    "image_path" TEXT,
    "text" TEXT,
    "aggregated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

CREATE TABLE "comment" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "feed_item_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "guild.name_unique" ON "guild"("name");
CREATE UNIQUE INDEX "users.uuid_unique" ON "users"("uuid");
CREATE UNIQUE INDEX "action_type.code_unique" ON "action_type"("code");
CREATE UNIQUE INDEX "feed_item.uuid_unique" ON "feed_item"("uuid");
CREATE UNIQUE INDEX "feed_item_action_id_unique" ON "feed_item"("action_id");


ALTER TABLE "users" ADD FOREIGN KEY ("team_id") REFERENCES "guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "feed_item" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "action" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "action" ADD FOREIGN KEY ("action_type_id") REFERENCES "action_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comment" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comment" ADD FOREIGN KEY ("feed_item_id") REFERENCES "feed_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
