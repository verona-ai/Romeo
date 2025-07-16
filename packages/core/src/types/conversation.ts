import { Platform } from './platform.js';
import { Message } from './message.js';

export type ConversationStatus = 'active' | 'paused' | 'closed' | 'archived';

export interface Conversation {
  id: string;
  platform: Platform;
  platformConversationId?: string;
  userId: string;
  title?: string;
  status: ConversationStatus;
  isGroup?: boolean;
  participants?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
}

export interface ConversationContext {
  conversation: Conversation;
  messageHistory: Message[];
  userProfile?: Record<string, any>;
  sessionData?: Record<string, any>;
} 