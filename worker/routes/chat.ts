import { FastifyInstance } from "fastify";
import { generateResponse } from "../agent.js";
import type { ChatRequest, ChatResponse } from "../types/index.js";

export async function chatRoutes(fastify: FastifyInstance) {
  // POST /api/chat - Send a message to the Romeo agent
  fastify.post<{
    Body: ChatRequest;
    Reply: ChatResponse;
  }>("/api/chat", async (request, reply) => {
    const { message, conversationId, userId } = request.body;
    const threadId = conversationId || "default-thread";

    try {
      if (!message || typeof message !== "string") {
        return reply.code(400).send({
          response: "",
          conversationId: threadId,
          timestamp: new Date().toISOString(),
          error: "Message is required and must be a string"
        });
      }

      // Use provided IDs or generate defaults
      const resourceId = userId || "default-user";

      // Generate AI response using the Romeo agent with memory
      const response = await generateResponse(message, resourceId, threadId);

      const chatResponse: ChatResponse = {
        response,
        conversationId: threadId,
        timestamp: new Date().toISOString()
      };

      return reply.code(200).send(chatResponse);
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      return reply.code(500).send({
        response: "",
        conversationId: threadId,
        timestamp: new Date().toISOString(),
        error: "Internal server error"
      });
    }
  });

  // GET /api/chat/health - Check if the chat system is working
  fastify.get("/api/chat/health", async (request, reply) => {
    try {
      // Test the agent with a simple message
      const testResponse = await generateResponse(
        "Hello, this is a health check.",
        "health-check-user",
        "health-check-thread"
      );

      return reply.code(200).send({
        status: "healthy",
        message: "Chat system is operational",
        testResponse: testResponse.substring(0, 100) + "...", // Truncate for brevity
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Chat health check failed:", error);
      return reply.code(500).send({
        status: "unhealthy",
        message: "Chat system is not operational",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      });
    }
  });
}
