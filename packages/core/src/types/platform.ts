export type Platform = 
  | 'whatsapp'
  | 'telegram'
  | 'discord'
  | 'slack'
  | 'messenger'
  | 'instagram'
  | 'twitter'
  | 'webchat'
  | 'sms'
  | 'email';

export interface PlatformConfig {
  platform: Platform;
  credentials: Record<string, string>;
  webhookUrl?: string;
  options?: Record<string, any>;
}

export interface PlatformCapabilities {
  supportsText: boolean;
  supportsImages: boolean;
  supportsVideos: boolean;
  supportsFiles: boolean;
  supportsAudio: boolean;
  supportsButtons: boolean;
  supportsCarousels: boolean;
  supportsQuickReplies: boolean;
  supportsRichMedia: boolean;
  supportsWebhooks: boolean;
  supportsRealtime: boolean;
  supportsDeliveryReceipts: boolean;
  supportsReadReceipts: boolean;
  supportsTypingIndicators: boolean;
} 