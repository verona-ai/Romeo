# @romeo/database

Database package that integrates Prisma ORM with Supabase for authentication, real-time features, and storage.

## Features

- **Prisma ORM** for type-safe database operations
- **Supabase Auth** for user authentication
- **Supabase Realtime** for live updates
- **Supabase Storage** for file management
- **Unified Database Client** that combines both services

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Database URLs
DATABASE_URL="postgresql://user:password@localhost:5432/romeo_db"
DIRECT_URL="postgresql://user:password@localhost:5432/romeo_db"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

## Usage

### Basic Usage

```typescript
import { db, prisma, supabase } from '@romeo/database';

// Using the unified client
const customer = await db.getCustomerByEmail('user@example.com');

// Using Prisma directly
const customers = await prisma.customer.findMany();

// Using Supabase directly
const { data: user } = await supabase.auth.getUser();
```

### Database Client Methods

```typescript
// Authentication
const user = await db.getCurrentUser();

// Customer operations
const customer = await db.getCustomerByEmail('user@example.com');

// Conversation operations
const conversation = await db.createCustomerConversation(customerId, 'Chat Title');

// Message operations
await db.addMessage(conversationId, 'Hello!', 'USER');

// Real-time subscriptions
const subscription = db.subscribeToConversation(conversationId, (payload) => {
  console.log('New message:', payload);
});

// Transactions
await db.transaction(async (tx) => {
  // Your transaction logic here
});
```

### Client-side Usage (Next.js)

```typescript
import { createSupabaseClient } from '@romeo/database';

// In client components
const supabase = createSupabaseClient();
```

### Server-side Usage (Next.js)

```typescript
import { createSupabaseServerClient } from '@romeo/database';
import { cookies } from 'next/headers';

// In server components or API routes
const cookieStore = await cookies();
const supabase = createSupabaseServerClient({
  get: (name: string) => cookieStore.get(name)?.value,
  set: (name: string, value: string, options?: any) => cookieStore.set(name, value, options),
  remove: (name: string, options?: any) => cookieStore.delete(name)
});
```

## Database Schema

The Prisma schema includes:

- **Customer**: Customer information and status
- **Conversation**: Chat conversations between customers and support
- **Message**: Individual messages within conversations

## Real-time Features

Subscribe to live updates on conversations:

```typescript
const subscription = db.subscribeToConversation(conversationId, (payload) => {
  // Handle real-time message updates
  console.log('Message update:', payload);
});

// Clean up subscription
subscription.unsubscribe();
```

## Available Scripts

```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes to database
pnpm db:push

# Run migrations
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio

# Seed database
pnpm db:seed
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Application   │    │   Application   │
│   (Next.js)     │    │   (Other)       │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌─────────────────┐
         │ @romeo/database │
         │                 │
         │  ┌───────────┐  │
         │  │ Unified   │  │
         │  │ Client    │  │
         │  └───────────┘  │
         │        │        │
         │  ┌─────┴─────┐  │
         │  │   Prisma  │  │  ┌─────────────┐
         │  │    ORM    │──┼──│ PostgreSQL  │
         │  └───────────┘  │  │  Database   │
         │                 │  └─────────────┘
         │  ┌───────────┐  │
         │  │ Supabase  │  │  ┌─────────────┐
         │  │  Client   │──┼──│  Supabase   │
         │  └───────────┘  │  │  Platform   │
         └─────────────────┘  └─────────────┘
``` 