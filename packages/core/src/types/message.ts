import { z } from 'zod';
import { Platform } from './platform.js';

export type MessageType = 
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'file'
  | 'location'
  | 'contact'
  | 'interactive'
  | 'system';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface BaseMessage {
  id: string;
  platform: Platform;
  conversationId: string;
  userId: string;
  type: MessageType;
  role: MessageRole;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface TextMessage extends BaseMessage {
  type: 'text';
  content: string;
}

export interface MediaMessage extends BaseMessage {
  type: 'image' | 'video' | 'audio' | 'file';
  mediaUrl: string;
  mimeType: string;
  caption?: string;
  fileSize?: number;
}

export interface LocationMessage extends BaseMessage {
  type: 'location';
  latitude: number;
  longitude: number;
  address?: string;
}

export interface ContactMessage extends BaseMessage {
  type: 'contact';
  name: string;
  phone?: string;
  email?: string;
}

export interface InteractiveMessage extends BaseMessage {
  type: 'interactive';
  buttons?: MessageButton[];
  quickReplies?: QuickReply[];
  carousel?: CarouselItem[];
}

export interface SystemMessage extends BaseMessage {
  type: 'system';
  event: 'user_joined' | 'user_left' | 'conversation_started' | 'conversation_ended' | 'typing' | 'delivery_receipt' | 'read_receipt';
  content?: string;
}

export type Message = 
  | TextMessage 
  | MediaMessage 
  | LocationMessage 
  | ContactMessage 
  | InteractiveMessage 
  | SystemMessage;

export interface MessageButton {
  id: string;
  text: string;
  payload?: string;
  url?: string;
}

export interface QuickReply {
  id: string;
  text: string;
  payload?: string;
}

export interface CarouselItem {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  buttons?: MessageButton[];
}

// Zod schemas for validation
const BaseMessageSchema = z.object({
  id: z.string(),
  platform: z.enum(['whatsapp', 'telegram', 'discord', 'slack', 'messenger', 'instagram', 'twitter', 'webchat', 'sms', 'email']),
  conversationId: z.string(),
  userId: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  timestamp: z.date(),
  metadata: z.record(z.any()).optional(),
});

export const MessageSchema = BaseMessageSchema.and(z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    content: z.string(),
  }),
  z.object({
    type: z.enum(['image', 'video', 'audio', 'file']),
    mediaUrl: z.string().url(),
    mimeType: z.string(),
    caption: z.string().optional(),
    fileSize: z.number().optional(),
  }),
  z.object({
    type: z.literal('location'),
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }),
  z.object({
    type: z.literal('contact'),
    name: z.string(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
  }),
  z.object({
    type: z.literal('interactive'),
    buttons: z.array(z.object({
      id: z.string(),
      text: z.string(),
      payload: z.string().optional(),
      url: z.string().url().optional(),
    })).optional(),
    quickReplies: z.array(z.object({
      id: z.string(),
      text: z.string().optional(),
      payload: z.string().optional(),
    })).optional(),
  }),
  z.object({
    type: z.literal('system'),
    event: z.enum(['user_joined', 'user_left', 'conversation_started', 'conversation_ended', 'typing', 'delivery_receipt', 'read_receipt']),
    content: z.string().optional(),
  }),
])); 