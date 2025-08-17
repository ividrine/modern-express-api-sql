<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<div align="center">

[![codecov](https://codecov.io/gh/ividrine/express-api-sql/graph/badge.svg?token=WN052EGT8S)](https://codecov.io/gh/ividrine/express-api-sql)

   <h3 align="center">Express API SQL</h3>

  <p align="center">
   A modern node/express API boilerplate for relational databases.
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
   </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Fork of [RESTful API Node Server Boilerplate](https://github.com/hagopj13/node-express-boilerplate) that adds type safety and works for relational databases.

## Prerequisites

- [Node](https://nodejs.org/en/download)
- [Docker](https://www.docker.com/) - for local external app dependencies (Postgres, PGAdmin, Valkey)

## Quick Start

1. Run `npx create-express-sql-app yourAppName` or `npm init express-sql-app yourAppName` to initialize a new project.
2. `cd yourAppName` and `npm run dev` to start the app

## Features

- Type Safety - [Typescript](https://www.typescriptlang.org/)
- Relational Database / ORM - [PostgreSql](https://www.postgresql.org/) and [Prisma](https://www.prisma.io/)
- Authentication / Authorization - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) and [node-oauth2-jwt-bearer](https://github.com/auth0/node-oauth2-jwt-bearer)
- Request Data Validation - [Zod](https://zod.dev/)
- Logging - [Winston](https://github.com/winstonjs/winston) and [Morgan](https://github.com/expressjs/morgan)
- Unit and Integration Tests - [Vitest](https://vitest.dev/)
- Error handling: centralized error handling mechanism
- Dependency Management - [PNPM](https://pnpm.io/)
- Git Hooks - [Husky](https://typicode.github.io/husky/) and [Lint-staged](https://github.com/lint-staged/lint-staged)
- Linting - [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/)
- Local Infrastructure - [Docker](https://www.docker.com/)

## Commands

### `dev`

Starts external app dependencies with docker-compose, runs prisma migration and seeds database if needed, and starts app in watch mode.

### `envup`

Starts external app dependencies with docker-compose.

### `envdown`

Tears down external app dependencies. You can pass arguments to underlying docker-compose command like this `pnpm envup -- -v` to also remove volumes.

### `test`

Starts external app dependencies with docker-compose, runs prisma migration and runs vitest with ui and coverage options.

## Environment Variables

This project uses `.env` files to load environment variables into node's `process.env` object for local development. They are git ignored to avoid checking secrets and other sensitive data into source control. See [here](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs) for more information about environment variables in node.

The environment variables can be found and modified in the `.env` file. They come with these default values

```
# App
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/appdb

# Valkey
VALKEY_URL=localhost:6379

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

```
src\
 |--config\         # Environment variables and configuration related things
 |--constants\      # App constants
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--lib\            # Db clients / connections / integrations
 |--middlewares\    # Custom express middlewares
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--types\          # Typescript types/interfaces
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

## API Documentation

## Error Handling

## Validation

## Authentication

## Authorization

## Logging

## Linting

## Tests
