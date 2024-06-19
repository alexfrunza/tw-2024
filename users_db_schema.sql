DROP TABLE IF EXISTS "user";

CREATE TABLE "user"(
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "password" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);
