import dotenv from "dotenv";
import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";

// Load environment variables first
dotenv.config();

// PostgreSQL Memory Configuration
// This uses Mastra's built-in memory system with PostgreSQL storage
// Automatically creates and manages these tables:
// - mastra_messages (for conversation messages)
// - mastra_threads (for conversation threads)
// - mastra_resources (for user/resource data)
// - mastra_traces (for debugging/analytics)
// - mastra_evals (for evaluations)

let memory: Memory | null = null;

export function initializeMemory(): Memory | null {
  if (!memory) {
    const connectionString = process.env.DATABASE_URL ||
      "postgresql://romeo:romeo_password@localhost:5432/romeo";
    
    // Debug: Log the connection string being used
    console.log("🔍 Memory initialization - DATABASE_URL:", connectionString);
    
    try {
      // Parse connection string to individual components (matching official docs)
      const url = new URL(connectionString);
      const host = url.hostname;
      const port = parseInt(url.port) || 5432;
      const user = url.username;
      const password = url.password;
      const database = url.pathname.slice(1); // Remove leading '/'

      // Use the official Mastra format without schemaName
      const postgresStore = new PostgresStore({
        host,
        port,
        user,
        password,
        database,
      });

      memory = new Memory({
        storage: postgresStore,
        options: {
          lastMessages: 10,
          semanticRecall: {
            topK: 3,
            messageRange: 2,
          },
        },
      });
      
      console.log("✅ Memory system initialized successfully using official Mastra format");
      return memory;
    } catch (error: any) {
      console.warn("⚠️ Memory initialization failed, continuing without persistent memory:");
      console.warn("Error details:", error.message);
      
      // Check for specific PostgreSQL errors that we can gracefully handle
      if (error.code === '42P07' || // relation already exists
          error.code === '23505' || // unique constraint violation
          error.message.includes('already exists') ||
          error.message.includes('constraint')) {
        console.warn("🔧 PostgreSQL constraint conflict detected - this is usually safe to ignore");
      }
      
      // Return null to indicate memory is not available
      return null;
    }
  }

  return memory;
}

export function getMemory(): Memory | null {
  if (!memory) {
    console.warn("⚠️ Memory system not available - will operate without persistent memory");
    return null;
  }
  return memory;
}
