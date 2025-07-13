import cors from "@fastify/cors";
import dotenv from "dotenv";
import Fastify from "fastify";
import { chatRoutes } from "./routes/chat.js";

// Load environment variables
dotenv.config();

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info"
  }
});

// Register CORS
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || "*"
});

// Register chat routes
await fastify.register(chatRoutes);

// Health check endpoint
fastify.get("/api/health", async (request, reply) => {
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  };
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || "3030");
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 Romeo API server running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
