import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";

// PostgreSQL Memory Configuration
// This uses Mastra's built-in memory system with PostgreSQL storage
// Automatically creates and manages these tables:
// - mastra_messages (for conversation messages)
// - mastra_threads (for conversation threads)
// - mastra_resources (for user/resource data)
// - mastra_traces (for debugging/analytics)
// - mastra_evals (for evaluations)

let memory: Memory | null = null;

export function initializeMemory(): Memory {
  if (!memory) {
    const postgresStore = new PostgresStore({
      connectionString:
        process.env.DATABASE_URL ||
        "postgresql://romeo:romeo_password@localhost:5432/romeo",
      schemaName: "mastra"
    });

    memory = new Memory({
      storage: postgresStore
    });
  }

  return memory;
}

export function getMemory(): Memory {
  if (!memory) {
    throw new Error("Memory not initialized. Call initializeMemory() first.");
  }
  return memory;
}
