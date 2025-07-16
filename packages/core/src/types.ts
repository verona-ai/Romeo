// Core types for Romeo chat platform integrations

export interface PlatformConfig {
  platform: string;
  apiKey?: string;
  apiUrl?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  debug?: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  channelId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ChatUser {
  id: string;
  username: string;
  displayName?: string;
  email?: string;
  avatar?: string;
  metadata?: Record<string, any>;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'public' | 'private';
  memberCount?: number;
  metadata?: Record<string, any>;
}

export interface MessageOptions {
  text?: string;
  attachments?: any[];
  metadata?: Record<string, any>;
}

// Message type definitions
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
  platform: string;
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

export interface EventCallback {
  (event: any): Promise<void> | void;
}

export interface WebhookHandler {
  handleWebhook(payload: any, headers: Record<string, string>): Promise<any>;
  verifySignature?(payload: string, signature: string, secret: string): boolean;
}

export interface PlatformClient {
  config: PlatformConfig;
  sendMessage(channelId: string, message: MessageOptions): Promise<ChatMessage>;
  getUser(userId: string): Promise<ChatUser>;
  getChannel(channelId: string): Promise<ChatChannel>;
  onMessage(callback: EventCallback): void;
  onInteraction?(callback: EventCallback): void;
} 