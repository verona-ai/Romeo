# Romeo 🤖

### Modern TypeScript AI Customer Service Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![SST](https://img.shields.io/badge/SST-f55650?style=for-the-badge&logo=sst&logoColor=white)](https://sst.dev/)

Romeo is a production-ready AI customer service platform built with the **modern simple stack** - proving that you don't need Docker/Kubernetes complexity to build serious software.

---

## 🚀 The Modern Simple Stack

**Frontend & API**: Next.js 15 + API Routes (deployed on Vercel)  
**Database**: Supabase (PostgreSQL + Auth + Storage)  
**Backend API**: AWS Lambda via SST (Infrastructure as Code)  
**AI**: OpenAI GPT-4  
**ORM**: Prisma  
**Cost**: $0-50/month for thousands of users  

### This Stack Powers:
- **Vercel**: Their own billion-dollar product
- **Linear**: $50M+ valuation  
- **Hundreds of unicorn startups**

---

## ✨ Why This Approach?

### ❌ The Old Way (Complex)
```bash
# Docker, Kubernetes, Terraform, custom networking...
docker-compose up -d
kubectl apply -f k8s/
terraform plan && terraform apply
# Hours of DevOps setup before writing a single line of business logic
```

### ✅ The New Way (Simple)
```bash
# Just code your features
pnpm install
pnpm dev
# Deploy with one command
vercel deploy
sst deploy
```

### Scale Reality Check:
- **1-1000 users**: Simple stack handles easily
- **1000-10000 users**: Same stack, just paying more  
- **10000+ users**: NOW you might need complex infrastructure (but you have revenue to hire help)

**Complex infrastructure is the RESULT of success, not a prerequisite for it.**

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Frontend (Vercel)"
        W[Next.js 15<br/>React + API Routes]
    end
    
    subgraph "Backend (AWS via SST)"
        A[Lambda Functions<br/>Chat API]
    end
    
    subgraph "Database (Supabase)"
        D[PostgreSQL<br/>Auth + Storage]
    end
    
    subgraph "AI"
        O[OpenAI GPT-4]
    end
    
    W --> A
    W --> D
    A --> D
    A --> O
```

---

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/your-org/romeo.git
cd romeo
pnpm install
```

### 2. Set up Supabase
1. Go to [database.new](https://database.new)
2. Create a new project
3. Copy your credentials to `web/.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_supabase_database_url

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

### 3. Database Setup
```bash
cd packages/database
pnpm run db:push    # Push schema to Supabase
pnpm run db:studio  # Open Prisma Studio
```

### 4. Start Development
```bash
cd web
pnpm dev
```

Access at: http://localhost:3000

### 5. Deploy (Optional)

**Frontend (Vercel)**:
```bash
vercel deploy
```

**Backend API (AWS via SST)**:
```bash
sst deploy
```

---

## 💡 Features

### 🤖 AI Customer Service
- **GPT-4 Powered**: Professional, context-aware responses
- **Conversation Memory**: Persistent chat history
- **Smart Escalation**: Knows when to involve humans
- **Multi-Channel**: Web, API, future integrations

### 📊 Modern Dashboard
- **Real-time Metrics**: Customer stats, conversation tracking
- **Beautiful UI**: Tailwind CSS + Radix UI components
- **Responsive Design**: Works on all devices
- **Type-Safe**: Full TypeScript coverage

### 🔐 Production Ready
- **Supabase Auth**: Built-in authentication system
- **Row-Level Security**: Database-level permissions
- **Environment Config**: Secure credential management
- **Health Monitoring**: Built-in health checks

---

## 🛠️ Development

### Project Structure
```
romeo/
├── web/                    # Next.js app
│   ├── src/app/           # App router pages
│   ├── src/components/    # React components
│   ├── src/lib/           # Utilities
│   └── src/app/api/       # API routes
├── functions/             # SST Lambda functions
├── packages/database/     # Shared Prisma schema
└── sst.config.ts         # AWS infrastructure config
```

### Key Commands
```bash
# Development
pnpm dev                   # Start Next.js dev server
pnpm db:studio            # Open database admin
pnpm db:push              # Push schema changes

# Deployment
vercel deploy             # Deploy frontend
sst deploy                # Deploy backend API

# Database
pnpm db:generate          # Generate Prisma client
pnpm db:push              # Push schema to Supabase
```

---

## 🌟 Use Cases

### ✅ Perfect For:
- **Startups**: Get to market fast without DevOps overhead
- **SMBs**: Professional customer service without enterprise complexity
- **Side Projects**: MVP to production in hours, not weeks
- **Agencies**: Deliver client projects rapidly

### 🔄 Easy to Scale:
- **More Users**: Vercel/Supabase auto-scale
- **More Features**: Add API routes, database tables
- **Team Growth**: TypeScript + modern tools = easy onboarding

---

## 🎯 The OSS Philosophy

**Start Simple. Ship Fast. Scale When Needed.**

This project proves that modern "simple" tools are actually premium:
- **Next.js**: Powers Vercel ($1B+ valuation)
- **Supabase**: Handles millions of users daily
- **Vercel**: Serves 100B+ requests per month
- **AWS Lambda**: Scales to any load automatically

You don't need to master Docker to build serious software. You need to master solving customer problems.

---

## 🤝 Contributing

We welcome contributions! Romeo proves that simple architectures enable faster development.

### Quick Contribution Guide:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test with `pnpm dev`
5. Submit a PR

### Areas for Contribution:
- 🎨 UI/UX improvements
- 🔌 New integrations (Slack, Discord, etc.)
- 🤖 AI enhancements
- 📱 Mobile optimizations
- 📚 Documentation

---

## 📞 Support & Community

- **Discord**: [Join our community](https://discord.gg/romeo)
- **GitHub**: [Open an issue](https://github.com/your-org/romeo/issues)  
- **Email**: hello@romeo.ai
- **Docs**: [Full documentation](https://docs.romeo.ai)

---

## 📄 License

MIT License - use it, modify it, ship it!

---

## 🙏 Built With

- **[Next.js](https://nextjs.org/)** - React framework
- **[Supabase](https://supabase.com/)** - Database + Auth + Storage
- **[OpenAI](https://openai.com/)** - AI models
- **[Prisma](https://prisma.io/)** - Type-safe database access
- **[SST](https://sst.dev/)** - Infrastructure as Code for AWS
- **[Vercel](https://vercel.com/)** - Frontend deployment
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Radix UI](https://radix-ui.com/)** - Headless UI components

---

<div align="center">

**⭐ Star this repo if it helped you build without Docker complexity!**

**[⬆ Back to Top](#romeo-)**

Made with ❤️ by developers who believe in simple solutions

[Website](https://romeo.ai) • [Demo](https://demo.romeo.ai) • [Discord](https://discord.gg/romeo) • [Twitter](https://twitter.com/romeo_ai)

</div>
