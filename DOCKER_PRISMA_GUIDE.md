# Romeo Docker Setup Guide

This guide explains how to run the complete Romeo AI agent system using Docker Compose, including the database, worker service, and optional web application.

## Overview

The containerized setup includes:
- **PostgreSQL Database**: Running in a Docker container
- **Migration Service**: A dedicated container for running Prisma commands
- **Worker Service**: The Romeo AI agent API running on port 3030
- **Helper Script**: `scripts/docker-db.sh` for easy service management

## Quick Start

### 1. Environment Setup

```bash
# Copy environment template and configure
cp docker.env .env

# Edit .env and add your OpenAI API key
nano .env  # or use your preferred editor
```

**Required**: Set your `OPENAI_API_KEY` in the `.env` file.

### 2. Complete System Setup

```bash
# Complete setup - database + worker service
./scripts/docker-db.sh full-setup
```

This will:
- Start PostgreSQL database
- Run Prisma migrations
- Build and start the Romeo AI agent worker
- Make the API available at http://localhost:3030

### 3. Test the Setup

```bash
# Health check
curl http://localhost:3030/api/health

# Test chat API
curl -X POST http://localhost:3030/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, Romeo!"}'
```

> **Note**: There's currently a known issue with the multi-schema setup (`previewFeatures = ["multiSchema"]`). If you encounter schema parsing errors, see the troubleshooting section below.

## Available Commands

### Complete System Management

```bash
# Setup complete Romeo system (database + worker)
./scripts/docker-db.sh full-setup

# Start worker service only
./scripts/docker-db.sh worker

# View worker service logs
./scripts/docker-db.sh worker-logs

# Open shell in worker container
./scripts/docker-db.sh worker-shell
```

### Database Management

```bash
# Setup database only (without worker)
./scripts/docker-db.sh setup

# Push schema changes (good for development)
./scripts/docker-db.sh push

# Create and run migrations (good for production)
./scripts/docker-db.sh migrate [migration-name]

# Generate Prisma client
./scripts/docker-db.sh generate

# Open Prisma Studio
./scripts/docker-db.sh studio
```

### Database Operations

```bash
# Reset database (WARNING: destructive)
./scripts/docker-db.sh reset

# Connect to PostgreSQL directly
./scripts/docker-db.sh psql

# Open shell in migrations container
./scripts/docker-db.sh shell
```

### Service Management

```bash
# View migration service logs
./scripts/docker-db.sh logs

# Stop all services
./scripts/docker-db.sh down

# Remove all containers and volumes
./scripts/docker-db.sh clean
```

## Manual Docker Commands

If you prefer to run commands manually:

```bash
# Start the database
docker-compose up -d postgres

# Build and start migrations service
docker-compose build migrations
docker-compose up -d migrations

# Run Prisma commands
docker-compose exec migrations pnpm run db:push
docker-compose exec migrations pnpm run db:generate
docker-compose exec migrations pnpm run db:migrate
docker-compose exec migrations pnpm run db:studio

# Access PostgreSQL directly
docker-compose exec postgres psql -U romeo -d romeo
```

## Environment Variables

The setup uses these environment variables (configured in `.env` file):

### Required Variables
- `OPENAI_API_KEY`: Your OpenAI API key for the Romeo AI agent
- `DATABASE_URL`: Connection string for PostgreSQL
  - Docker: `postgresql://romeo:romeo_password@postgres:5432/romeo`

### Optional Variables
- `OPENAI_MODEL`: OpenAI model to use (default: `gpt-4o-mini`)
- `LOG_LEVEL`: Logging level (default: `info`)
- `CORS_ORIGIN`: CORS origin setting (default: `*`)

## Development Workflow

### 1. Daily Development

```bash
# Start the complete system
./scripts/docker-db.sh full-setup

# View logs for debugging
./scripts/docker-db.sh worker-logs

# Test the API
curl http://localhost:3030/api/health
```

### 2. Making Schema Changes

1. Edit your Prisma schema file (`packages/database/prisma/schema.prisma`)
2. Push changes to database: `./scripts/docker-db.sh push`
3. Generate client: `./scripts/docker-db.sh generate`
4. Restart worker to use new schema: `./scripts/docker-db.sh worker`

### 3. Testing Changes

```bash
# Open Prisma Studio to inspect data
./scripts/docker-db.sh studio

# Connect to PostgreSQL directly
./scripts/docker-db.sh psql

# Test chat functionality
curl -X POST http://localhost:3030/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message"}'
```

### 4. Creating Production Migrations

```bash
# Create a named migration
./scripts/docker-db.sh migrate add-new-feature

# This will create a migration file in packages/database/prisma/migrations/
```

## Services Overview

After running `./scripts/docker-db.sh full-setup`, you'll have:

- **Database**: PostgreSQL on port 5432
- **Romeo AI Agent**: HTTP API on port 3030
- **Prisma Studio**: Available via `./scripts/docker-db.sh studio`

### API Endpoints

- **Health Check**: `GET http://localhost:3030/api/health`
- **Chat**: `POST http://localhost:3030/api/chat`
- **Chat Health**: `GET http://localhost:3030/api/chat/health`

## Troubleshooting

### Worker Service Issues

**Problem**: Worker service fails to start

**Solutions**:
1. Check if OpenAI API key is set: `cat .env | grep OPENAI_API_KEY`
2. View worker logs: `./scripts/docker-db.sh worker-logs`
3. Restart worker: `docker-compose restart worker`

**Problem**: API returns 500 errors

**Solutions**:
1. Check database connection: `./scripts/docker-db.sh psql`
2. Ensure Prisma client is generated: `./scripts/docker-db.sh generate`
3. Check worker logs for detailed errors

### Multi-Schema Issues

**Problem**: Error with `Could not parse schema engine response: SyntaxError: Unexpected token E in JSON at position 0`

**Cause**: The current Prisma version (5.22.0) has compatibility issues with the multi-schema setup in Docker environments.

**Solutions**:

1. **Option 1 - Disable Multi-Schema Temporarily**:
   ```prisma
   // Comment out the multiSchema feature
   generator client {
     provider = "prisma-client-js"
     output   = "../node_modules/.prisma/client"
     // previewFeatures = ["multiSchema"]
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     // schemas  = ["mastra", "public"]
   }
   ```

2. **Option 2 - Use Single Schema with Prefixes**:
   ```prisma
   // Use table prefixes instead of separate schemas
   model MastraMessage {
     // ...
     @@map("mastra_messages")
   }
   ```

3. **Option 3 - Manual Schema Creation**:
   ```bash
   # Create schemas manually
   ./scripts/docker-db.sh psql
   # Then run: CREATE SCHEMA IF NOT EXISTS mastra;
   ```

### Database Connection Issues

```bash
# Check if database is running
docker-compose ps

# Check database logs
docker-compose logs postgres

# Check if database is ready
docker-compose exec postgres pg_isready -U romeo -d romeo
```

### Migration Service Issues

```bash
# Check migrations service logs
./scripts/docker-db.sh logs

# Rebuild migrations service
docker-compose build migrations
```

### OpenSSL Warnings

The OpenSSL warnings are normal in Alpine containers and don't affect functionality:
```
prisma:warn Prisma failed to detect the libssl/openssl version to use...
```

### Reset Everything

```bash
# Remove all containers and volumes (WARNING: destructive)
./scripts/docker-db.sh clean

# Then run setup again
./scripts/docker-db.sh setup
```

## Workaround for Multi-Schema

If you need to use the multi-schema setup, here's a working approach:

1. **Create schemas manually**:
   ```bash
   ./scripts/docker-db.sh psql
   CREATE SCHEMA IF NOT EXISTS mastra;
   CREATE SCHEMA IF NOT EXISTS public;
   ```

2. **Use native PostgreSQL migrations**:
   ```bash
   # Create tables using SQL files
   docker-compose exec postgres psql -U romeo -d romeo -f /path/to/migration.sql
   ```

3. **Test with simplified schema**:
   ```bash
   # Create a test schema without multi-schema
   docker-compose exec migrations /bin/sh -c "cd /app/packages/database && cat > test.prisma << 'EOF'
   generator client {
     provider = \"prisma-client-js\"
   }

   datasource db {
     provider = \"postgresql\"
     url      = env(\"DATABASE_URL\")
   }

   model Test {
     id   Int    @id @default(autoincrement())
     name String
   }
   EOF"

   # Test push
   docker-compose exec migrations npx prisma db push --schema=test.prisma
   ```

## File Structure

```
Romeo/
├── docker-compose.yml          # Docker services configuration
├── Dockerfile.migrations       # Migration service Dockerfile
├── scripts/
│   └── docker-db.sh           # Helper script for database operations
└── packages/database/
    ├── prisma/
    │   ├── schema.prisma      # Your Prisma schema
    │   └── migrations/        # Migration files
    └── package.json           # Database package with Prisma scripts
```

## Best Practices

1. **Use `push` for development**: Quick and easy for schema changes
2. **Use `migrate` for production**: Creates proper migration files
3. **Always generate client**: After schema changes, run `generate`
4. **Test changes**: Use Prisma Studio or direct PostgreSQL access
5. **Backup before reset**: The `reset` command is destructive
6. **Monitor for multi-schema issues**: Check logs for parsing errors

## Common Use Cases

### Adding a New Model

1. Add model to `packages/database/prisma/schema.prisma`
2. Run: `./scripts/docker-db.sh push`
3. Run: `./scripts/docker-db.sh generate`

### Modifying Existing Model

1. Edit model in schema file
2. Run: `./scripts/docker-db.sh push`
3. Run: `./scripts/docker-db.sh generate`

### Preparing for Production

1. Create migration: `./scripts/docker-db.sh migrate add-feature-name`
2. Test migration: `./scripts/docker-db.sh reset` then `./scripts/docker-db.sh migrate`
3. Commit migration files to version control

## Integration with Applications

The web application and worker can connect to the database using:

```env
DATABASE_URL="postgresql://romeo:romeo_password@postgres:5432/romeo"
```

Or if running locally:

```env
DATABASE_URL="postgresql://romeo:romeo_password@localhost:5432/romeo"
```

## Next Steps

1. **Update Prisma Version**: Monitor for updates that fix multi-schema issues
2. **Consider Schema Consolidation**: Evaluate if multi-schema is necessary
3. **Implement Proper CI/CD**: Use migrations in production pipelines
4. **Monitor Database Performance**: Use PostgreSQL monitoring tools 