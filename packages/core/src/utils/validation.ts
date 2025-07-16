import { z } from 'zod';
import { MessageSchema } from '../types/message.js';

export function validateMessage(data: unknown) {
  return MessageSchema.parse(data);
}

export function isValidMessage(data: unknown): data is z.infer<typeof MessageSchema> {
  return MessageSchema.safeParse(data).success;
}

export const PlatformConfigSchema = z.object({
  platform: z.enum(['whatsapp', 'telegram', 'discord', 'slack', 'messenger', 'instagram', 'twitter', 'webchat', 'sms', 'email']),
  credentials: z.record(z.string()),
  webhookUrl: z.string().url().optional(),
  options: z.record(z.any()).optional(),
});

export function validatePlatformConfig(data: unknown) {
  return PlatformConfigSchema.parse(data);
}

export const WebhookVerificationSchema = z.object({
  signature: z.string(),
  body: z.string(),
  secret: z.string(),
});

export function validateWebhookSignature(data: unknown) {
  return WebhookVerificationSchema.parse(data);
} 