DROP TABLE IF EXISTS "award_actor";
DROP TABLE IF EXISTS "award_show";
DROP TABLE IF EXISTS "show";
DROP TABLE IF EXISTS "actor";
DROP TABLE IF EXISTS "award";

CREATE TABLE "show"(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL
);

CREATE TABLE "actor"(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL
);

CREATE TABLE "award"(
    "id" SERIAL PRIMARY KEY,
    "year" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    UNIQUE (year, name)
);

CREATE TABLE "award_actor"(
    "id" SERIAL PRIMARY KEY,
    "award_id" BIGINT NOT NULL,
    "actor_id" BIGINT NOT NULL,
    "won" BOOLEAN NOT NULL,
    "show_id" BIGINT NOT NULL,
    FOREIGN KEY ("show_id") REFERENCES "show"("id") ON DELETE CASCADE,
    FOREIGN KEY ("award_id") REFERENCES "award"("id") ON DELETE CASCADE,
    FOREIGN KEY ("actor_id") REFERENCES "actor"("id") ON DELETE CASCADE,
    UNIQUE (show_id, award_id, actor_id)
);

CREATE TABLE "award_show"(
    "id" SERIAL PRIMARY KEY,
    "award_id" BIGINT NOT NULL,
    "show_id" BIGINT NOT NULL,
    "won" BOOLEAN,
    FOREIGN KEY ("award_id") REFERENCES "award"("id") ON DELETE CASCADE,
    FOREIGN KEY ("show_id") REFERENCES "show"("id") ON DELETE CASCADE
);
