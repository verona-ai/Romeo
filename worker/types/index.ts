// Import standard message types from Mastra/AI SDK instead of defining our own
export type {
  CoreAssistantMessage,
  CoreMessage,
  CoreSystemMessage,
  CoreUserMessage
} from "@mastra/core";

export interface ChatRequest {
  message: string;
  conversationId?: string;
  userId?: string;
}

export interface ChatResponse {
  response: string;
  conversationId: string;
  timestamp: string;
  error?: string;
}

export interface HealthResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  version: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
}
