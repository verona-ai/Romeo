# Romeo Development Guide

## Overview
This guide covers the local development setup for the Romeo project, including database, web application, and worker services.

## Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL (installed via Homebrew)
- OpenAI API key

## Quick Start

### 1. Database Setup
```bash
# Start PostgreSQL
brew services start postgresql

# Create database
createdb romeo

# Set up environment
echo 'DATABASE_URL="postgresql://$(whoami)@localhost:5432/romeo"' > packages/database/.env

# Push schema
cd packages/database
pnpm run db:push
```

### 2. Web Application
```bash
# Set up environment
echo 'DATABASE_URL="postgresql://$(whoami)@localhost:5432/romeo"' > web/.env.local

# Start development server
cd web
pnpm run dev
```

Access at: http://localhost:3001

### 3. Worker Service ✅ OPERATIONAL
```bash
# Set up environment
cd worker
cat << 'EOF' > .env
DATABASE_URL="postgresql://$(whoami)@localhost:5432/romeo"
# Add your OpenAI API key here:
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
EOF

# Start worker
pnpm run dev
```

**Service Status**: ✅ All systems operational
- **Health endpoint**: `curl http://localhost:3030/api/health`
- **Chat health**: `curl http://localhost:3030/api/chat/health`
- **Test chat**: `curl -X POST http://localhost:3030/api/chat -H "Content-Type: application/json" -d '{"message": "Hello!"}'`

## Current Status

### ✅ Working Services
- **Database**: PostgreSQL with multi-schema support (mastra + public)
- **Web App**: http://localhost:3001 - Customer dashboard with database integration
- **Worker**: http://localhost:3030 - Romeo AI agent with OpenAI integration
- **Prisma Studio**: http://localhost:5555 - Database administration

### 🔧 Architecture
- **Multi-schema database**: 
  - `public` schema: Customer data
  - `mastra` schema: AI agent memory and conversation data
- **Monorepo structure**: Database package, web frontend, worker backend
- **AI Memory**: Persistent conversation history via Mastra framework

## Commands

### Database Commands
```bash
cd packages/database
pnpm run db:push        # Push schema changes
pnpm run db:generate    # Generate Prisma client
pnpm run db:studio      # Open Prisma Studio
```

### Development Commands
```bash
# Start all services
pnpm run dev            # Root level - runs all services

# Individual services
cd web && pnpm run dev  # Web app only
cd worker && pnpm run dev  # Worker only
```

## Testing

### Health Checks
```bash
# Web app
curl http://localhost:3001

# Worker health
curl http://localhost:3030/api/health

# Chat system
curl http://localhost:3030/api/chat/health
```

### Chat API Test
```bash
curl -X POST http://localhost:3030/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, can you help me?"}'
```

## Troubleshooting

### Database Issues
- Ensure PostgreSQL is running: `brew services start postgresql`
- Check database exists: `psql -l | grep romeo`
- Recreate if needed: `dropdb romeo && createdb romeo`

### Worker Issues
- Verify OpenAI API key is set in `worker/.env`
- Check database connection in worker logs
- Clean mastra schema if needed: `psql -d romeo -c "DROP SCHEMA IF EXISTS mastra CASCADE; CREATE SCHEMA mastra;"`

### Environment Setup
All services use the same DATABASE_URL format:
```
DATABASE_URL="postgresql://$(whoami)@localhost:5432/romeo"
```

## Next Steps
- **Docker**: Containerization setup available in `DOCKER_PRISMA_GUIDE.md`
- **Production**: Environment configuration for deployment
- **Testing**: Automated test setup for all services 