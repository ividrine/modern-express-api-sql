<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<div align="center">
   <h3 align="center">Express API SQL</h3>

  <p align="center">
   A modern express API boilerplate for relational databases.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
   <summary>Table of Contents</summary>
   <ol>
      <li><a href="#about-the-project">About The Project</a></li>
      <li><a href="#prerequisites">Prerequisites</a></li>
      <li>
         <a href="#quick-start">Quick Start</a>
         <ul>
            <li><a href="#pnpm">PNPM</a></li>
            <li><a href="#npm">NPM</a></li>
         </ul>
      </li>
      <li><a href="#features">Features</a></li>
      <li><a href="#commands">Commands</a></li>
      <li><a href="#environment-variables">Environment Variables</a></li>
      <li><a href="#project-structure">Project Structure</a></li>
      <li><a href="#api-documentation">API Documentation</a></li>
      <li><a href="#error-handling">Error Handling</a></li>
      <li><a href="#validation">Validation</a></li>
      <li><a href="#authentication">Authentication</a></li>
      <li><a href="#authorization">Authorization</a></li>
      <li><a href="#logging">Logging</a></li>
      <li><a href="#linting">Linting</a></li>
      <li><a href="#acknowledgments">Acknowledgments</a></li>
   </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project is a flavor of [RESTful API Node Server Boilerplate](https://github.com/hagopj13/node-express-boilerplate) that provides type safety and works for relational databases.

## Prerequisites

- [Node v22 or later](https://nodejs.org/en/download) - for `--env-file` flag
- [Docker](https://www.docker.com/) - for local infrastructure and tools (Postgres, PGAdmin, Valkey)
- [PNPM](https://pnpm.io/) - for better dependency management (recommended)

## Quick Start

Follow the instructions for the package manager you are using. NPM is the default package manager for Node.

### PNPM

1. Run `pnpm dlx create-express-sql-app yourAppName` or `pnpm create express-sql-app yourAppName` to initialize a new project.
2. Run `pnpm dev` in your new project's root directory to start the app.

### NPM

1. Run `npx create-express-sql-app yourAppName` or `npm init express-sql-app yourAppName` to initialize a new project.
2. Run `npm run dev` in your new project's root directory to start the app.

## Features

- Type Safety - [Typescript](https://www.typescriptlang.org/)
- Relational Database - [PostgreSql](https://www.postgresql.org/)
- ORM - [Prisma](https://www.prisma.io/)
- Code First Migrations - [Kysely-ctl](https://github.com/kysely-org/kysely-ctl)
- Cache Server - [Valkey](https://valkey.io/)
- Request Data Validation - [Zod](https://zod.dev/)
- Authorization - [node-oauth2-jwt-bearer](https://github.com/auth0/node-oauth2-jwt-bearer)
- JWT/JWK Manager - [Jose](https://github.com/panva/jose)
- Git Hooks - [Husky](https://typicode.github.io/husky/) and [Lint-staged](https://github.com/lint-staged/lint-staged)
- Linting - [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/)
- Logging - [Winston](https://github.com/winstonjs/winston) and [Morgan](https://github.com/expressjs/morgan)
- Testing - [Jest](https://jestjs.io/)
- Local Infrastructure - [Docker](https://www.docker.com/)
- Package Manager - [PNPM](https://pnpm.io/)

## Commands

### `pnpm dev`

Runs infrastructure in local containers if not already running, runs db migration if needed and then starts the app in watch mode.

### `pnpm envup`

Runs infrastructure in local containers

### `pnpm envdown`

Tear down local infrastructure

## Environment Variables

This project uses `.env` files to load environment variables into node's `process.env` object. It is git ignored to avoid checking secrets and other sensitive data into source control.

You can create multiple `.env` files, for example `.env.stage` or `.env.test` if you have different external infrastructure you want to connect to and test from your local machine. This project provides a `.env` file with credentials for connecting to your local infrastructure.

See [here](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs) for more information about environment variables in node.

```
# App
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/appdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Valkey
VALKEY_URL=localhost:6379
VALKEY_HOST=localhost
VALKEY_PORT=6379

# PG Admin
PGADMIN_DEFAULT_EMAIL=test@test.com
PGADMIN_DEFAULT_PASSWORD=postgres
PGADMIN_PORT=54321

# JWT
JWT_SECRET=thisisasamplesecret
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10
JWT_ISSUER=nodeapp
JWT_AUDIENCE=nodeapp

# SMTP - For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
SMTP_HOST=email-server
SMTP_PORT=587
SMTP_USERNAME=email-server-username
SMTP_PASSWORD=email-server-password
EMAIL_FROM=support@yourapp.com
```

## Project Structure

## API Documentation

## Error Handling

## Validation

## Authentication

## Authorization

## Logging

## Linting
