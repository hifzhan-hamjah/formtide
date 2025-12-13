# Formtide

Open-source form backend API (Formtide) built with Express + Prisma + Postgres.

## Features

- Create forms
- Accept submissions (stores JSON payload)
- View submissions via manage key
- Basic spam protection (rate limit + honeypot)
- Docker Compose for Postgres

## Quick start

```bash
docker compose up -d
cp .env.example .env
npm i
npx prisma migrate dev
npm run dev
```
