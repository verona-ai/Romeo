# Romeo Web Dashboard

This is the web dashboard for managing the Romeo AI customer experience agent.

## Features

- **Customer Management**: View and manage customer profiles
- **Conversation History**: Browse through customer conversations and messages
- **Agent Analytics**: Monitor agent performance and conversation metrics
- **Real-time Updates**: See live conversation data from the Mastra memory system

## Getting Started

1. Make sure the database is running and the Prisma client is generated
2. Create a `.env.local` file with:
   ```
   DATABASE_URL="postgresql://romeo:romeo_password@localhost:5432/romeo"
   NEXT_PUBLIC_API_URL="http://localhost:3001"
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture

The web app connects to:

- **PostgreSQL Database**: Using Prisma ORM to access customer data and Mastra schemas
- **Romeo Worker API**: For real-time agent interactions
- **Mastra Memory System**: For conversation history and working memory

## Database Schema

- **Customer** (public schema): Business customer data
- **MastraThread** (mastra schema): Conversation threads linked to customers
- **MastraMessage** (mastra schema): Individual messages in conversations
- **MastraResource** (mastra schema): Working memory and metadata
