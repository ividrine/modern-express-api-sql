docker-compose up --build -d

export NODE_OPTIONS="--env-file=.env.example"

kysely migrate latest

tsx watch src/index.ts