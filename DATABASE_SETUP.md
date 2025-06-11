# Database Setup Guide

## Prerequisites

You need a PostgreSQL database running. Here are several options:

## Option 1: Local PostgreSQL Installation

1. **Install PostgreSQL**:
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL service**:
   - Windows: Use pgAdmin or start from Services
   - macOS: `brew services start postgresql`
   - Linux: `sudo systemctl start postgresql`

3. **Create a database**:
   ```sql
   createdb learnpath_db
   ```

4. **Update your .env file**:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/learnpath_db"
   ```

## Option 2: Docker PostgreSQL

1. **Run PostgreSQL in Docker**:
   ```bash
   docker run --name learnpath-postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=learnpath_db \
     -p 5432:5432 \
     -d postgres:15
   ```

2. **Update your .env file**:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/learnpath_db"
   ```

## Option 3: Cloud Database (Recommended for Production)

### Supabase (Free tier available)
1. Go to https://supabase.com
2. Create a new project
3. Get your database URL from Settings > Database
4. Update your .env file with the provided URL

### Railway (Free tier available)
1. Go to https://railway.app
2. Create a new PostgreSQL database
3. Copy the connection string
4. Update your .env file

### Neon (Free tier available)
1. Go to https://neon.tech
2. Create a new database
3. Copy the connection string
4. Update your .env file

## Running Migrations

Once your database is set up and running:

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Verify setup**:
   ```bash
   npx prisma studio
   ```

## Troubleshooting

### Connection Issues
- Make sure PostgreSQL is running
- Check if the port (5432) is correct
- Verify username/password
- Check firewall settings

### Permission Issues
- Make sure the user has CREATE privileges
- Check if the database exists

### Migration Issues
- Try resetting: `npx prisma migrate reset`
- Check for syntax errors in schema.prisma

## Current Status

The application currently works with basic hash-based caching without vector embeddings. Once the database is set up, you'll get:

- User authentication and sessions
- Roadmap caching and retrieval
- Progress tracking
- Full vector similarity search (when pgvector is added)

## Adding Vector Search (Optional)

To enable full vector similarity search:

1. **Install pgvector extension**:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

2. **Update the Prisma schema** to include the embedding field:
   ```prisma
   embedding   Unsupported("vector(1536)")?
   ```

3. **Run migration**:
   ```bash
   npx prisma migrate dev --name add_vector
   ```

4. **Update vector-db.ts** to use full vector search functionality
