// Romeo Core - Shared types and utilities for chat platform integrations

export * from './types.js';

// Re-export message types for backward compatibility
export type {
  Message,
  TextMessage,
  MediaMessage,
  LocationMessage,
  ContactMessage,
  InteractiveMessage,
  SystemMessage,
  MessageButton,
  QuickReply,
  CarouselItem
} from './types.js';

// Version info
export const VERSION = '1.0.0';

// Utility functions
export const isValidPlatform = (platform: string): boolean => {
  const supportedPlatforms = ['slack', 'telegram', 'discord', 'whatsapp'];
  return supportedPlatforms.includes(platform.toLowerCase());
};

export const createPlatformConfig = (platform: string, options: Record<string, any>) => {
  return {
    platform: platform.toLowerCase(),
    ...options,
  };
}; 