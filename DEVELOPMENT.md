# Romeo Development Guide

## Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account
- OpenAI API key

### Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/your-org/romeo.git
   cd romeo
   pnpm install
   ```

2. **Set up Supabase**
   - Go to [database.new](https://database.new)
   - Create a new project
   - Copy credentials to `web/.env.local`

3. **Environment Configuration**
   ```bash
   # Copy example and configure
   cp web/.env.local.example web/.env.local
   # Edit with your Supabase and OpenAI credentials
   ```

4. **Database Setup**
   ```bash
   cd packages/database
   pnpm run db:push    # Push schema to Supabase
   pnpm run db:studio  # Open database admin
   ```

5. **Start Development**
   ```bash
   # Start the full application (frontend + API routes)
   cd web && pnpm dev
   # Or from root: pnpm dev
   ```

## Project Structure

```
romeo/
├── web/                    # Next.js frontend + API routes
│   ├── src/app/           # App router + API routes
│   │   ├── api/          # API endpoints (chat, health)
│   │   └── components/   # React components
│   ├── src/lib/          # Utilities, AI agent, types
│   └── src/components/   # Shared React components
├── packages/
│   └── database/         # Shared Prisma schema
└── vercel.json           # Vercel deployment config
```

## Development Workflow

### Local Development
```bash
# Start the full application (frontend + API routes)
cd web && pnpm dev        # Start Next.js dev server with API routes
# Or from root
pnpm dev                  # Uses turbo to start all packages

# Other commands
pnpm build                # Build for production
pnpm lint                 # Run linter
pnpm type-check          # Type checking
```

### Database Management
```bash
cd packages/database
pnpm run db:generate      # Generate Prisma client
pnpm run db:push          # Push schema changes
pnpm run db:studio        # Open Prisma Studio
```

## Key Services

### Frontend (Next.js)
- **Port**: 3000
- **API Routes**: `/api/chat`, `/api/health`
- **Components**: Modern React with Tailwind CSS

### Backend (Fastify)
- **Port**: 3030
- **Endpoints**: Chat API, health checks
- **AI Agent**: OpenAI integration with conversation memory

### Database (Supabase)
- **PostgreSQL**: Managed database
- **Auth**: Built-in authentication
- **Storage**: File uploads (future)

## Environment Variables

See `web/.env.local.example` for all required variables.

### Required
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `OPENAI_API_KEY`

### Optional
- `OPENAI_MODEL` (default: gpt-4o-mini)
- `PORT` (backend port, default: 3030)
- `LOG_LEVEL` (default: info)

## Deployment

### Development
```bash
# Start all services
pnpm dev

# Or start individually
cd web && pnpm dev        # Frontend
cd backend && pnpm dev    # Backend
```

### Production

**Frontend (Vercel)**:
```bash
vercel deploy
```

**Backend (AWS via SST)**:
```bash
sst deploy
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Check Supabase credentials
2. **OpenAI API**: Verify API key and model availability
3. **CORS Issues**: Check backend CORS configuration
4. **Build Errors**: Run `pnpm install` and `pnpm run db:generate`

### Debug Commands
```bash
# Check backend health
curl http://localhost:3030/api/health

# Test chat endpoint
curl -X POST http://localhost:3030/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Romeo!"}'

# Check Next.js health
curl http://localhost:3000/api/health
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `pnpm dev`
5. Submit a pull request

## Architecture Notes

This project uses the **Modern Simple Stack**:
- **No Docker**: Direct deployment to managed services
- **Supabase**: Replaces self-hosted PostgreSQL
- **Vercel**: Frontend hosting with edge functions
- **SST**: Infrastructure as Code for AWS services
- **TypeScript**: Full type safety across the stack

The goal is to minimize DevOps overhead while maintaining production-ready scalability. 