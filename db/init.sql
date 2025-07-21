-- Enable pgcrypto so Kysely’s UUID default helpers work, etc.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE DATABASE tacticsdb;