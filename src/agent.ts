import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { initializeMemory } from "./utils/memory.js";

// Initialize memory system
const memory = initializeMemory();

// Customer service agent instructions
const CUSTOMER_SERVICE_INSTRUCTIONS = `
You are Romeo, a helpful and professional customer service AI agent. Your role is to:

1. Assist customers with their inquiries in a friendly, professional manner
2. Provide accurate information and solutions to customer problems
3. Escalate complex issues to human agents when necessary
4. Maintain a helpful and empathetic tone throughout conversations
5. Ask clarifying questions when needed to better understand customer needs

Key guidelines:
- Always be polite and professional
- Keep responses concise but comprehensive
- If you don't know something, admit it and offer to help find the answer
- Focus on solving the customer's problem efficiently
- Use a warm, conversational tone while remaining professional

Remember: You represent the company, so always maintain high standards of customer service.
`;

// Create the Romeo customer service agent
export const romeoAgent = new Agent({
  name: "Romeo",
  instructions: CUSTOMER_SERVICE_INSTRUCTIONS,
  model: openai(process.env.OPENAI_MODEL || "gpt-4o-mini"),
  memory // Attach the PostgreSQL memory system
});

// Function to generate AI response using the agent
export async function generateResponse(
  message: string,
  resourceId: string = "default-user",
  threadId: string = "default-thread"
): Promise<string> {
  try {
    const response = await romeoAgent.generate(message, {
      resourceId,
      threadId
    });

    return (
      response.text ||
      "I apologize, but I encountered an error generating a response."
    );
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}
