# Pastebin Lite

- A lightweight, self-hostable pastebin application built with Next.js and PrismaORM(postgreSQL). Create and share text snippets with optional expiration controls.


## Folder Structure



## Features

- **Create Pastes** - Share text content via unique URLs
- **Time-to-Live (TTL)** - Optional expiration time in seconds
- **View Limits** - Optional maximum view count before paste becomes unavailable
- **REST API** - Programmatic access via JSON endpoints
- **Dark Theme UI** - Clean, minimal interface

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/healthz` | Health check endpoint |
| POST | `/api/pastes` | Create a new paste |
| GET | `/api/pastes/[id]` | Retrieve a paste by ID |
| GET | `/p/[id]` | View paste in browser |



# Run project locally

1. **clone the repository**:

```bash
git clone <Github_Repo_URL>
```

2. **Navigate and install the dependencies**:

```bash
cd my-app
npm install
```

3. **Set up environment variables**:

- Run the following command to create a `.env` file and initialize Prisma:
```bash
npx prisma init --db --output ../app/generated/prisma
npx prisma migrate dev --name init
npx prisma generate
```

4. **Start the development server**:

```bash
npm run build
npm run dev
```


# Persistent Layer Usage

- This project uses **PostgreSQL** as the database with **Prisma ORM** for data access.

## Architecture

- **Database**: PostgreSQL
- **ORM**: Prisma Client (v7.2.0)
- **Adapter**: `@prisma/adapter-pg` with native `pg` connection pooling

## Key Components

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema definition |
| `app/lib/db.ts` | Singleton Prisma client instance |
| `app/lib/services/paste.service.ts` | Data access layer for CRUD operations |


## Connection Management

- The Prisma client is instantiated as a singleton to prevent connection exhaustion during development (hot reloading). In production, a fresh client is created per instance.

## Data Model

- The `Paste` model stores text snippets with optional TTL and view limits:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique identifier (cuid) |
| `content` | String | The paste content |
| `createdAt` | DateTime | Creation timestamp |
| `expiresAt` | DateTime? | Optional TTL expiration |
| `maxViews` | Int? | Optional view limit |
| `viewCount` | Int | Current view count | 