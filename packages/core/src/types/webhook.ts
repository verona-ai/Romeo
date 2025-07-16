import { Message } from './message.js';
import { Platform } from './platform.js';

export type WebhookEventType = 
  | 'message_received'
  | 'message_delivered'
  | 'message_read'
  | 'user_typing'
  | 'user_joined'
  | 'user_left'
  | 'conversation_started'
  | 'conversation_ended'
  | 'webhook_verified';

export interface BaseWebhookEvent {
  type: WebhookEventType;
  platform: Platform;
  timestamp: Date;
  rawData?: any;
}

export interface MessageReceivedEvent extends BaseWebhookEvent {
  type: 'message_received';
  message: Message;
}

export interface MessageStatusEvent extends BaseWebhookEvent {
  type: 'message_delivered' | 'message_read';
  messageId: string;
  conversationId: string;
  userId: string;
}

export interface UserActivityEvent extends BaseWebhookEvent {
  type: 'user_typing' | 'user_joined' | 'user_left';
  conversationId: string;
  userId: string;
}

export interface ConversationEvent extends BaseWebhookEvent {
  type: 'conversation_started' | 'conversation_ended';
  conversationId: string;
  userId: string;
}

export interface WebhookVerificationEvent extends BaseWebhookEvent {
  type: 'webhook_verified';
  challenge?: string;
  verifyToken?: string;
}

export type WebhookEvent = 
  | MessageReceivedEvent
  | MessageStatusEvent
  | UserActivityEvent
  | ConversationEvent
  | WebhookVerificationEvent;

export interface WebhookHandler {
  handleEvent(event: WebhookEvent): Promise<void>;
  verifyWebhook?(signature: string, body: string): boolean;
} 