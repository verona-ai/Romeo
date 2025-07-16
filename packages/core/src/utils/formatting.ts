import { Message, TextMessage, MediaMessage, MessageButton } from '../types/message.js';

export function formatTextForPlatform(text: string, platform: string): string {
  switch (platform) {
    case 'whatsapp':
      return formatWhatsAppText(text);
    case 'telegram':
      return formatTelegramText(text);
    case 'discord':
      return formatDiscordText(text);
    case 'slack':
      return formatSlackText(text);
    default:
      return text;
  }
}

function formatWhatsAppText(text: string): string {
  // WhatsApp formatting: *bold*, _italic_, ~strikethrough~, ```code```
  return text
    .replace(/\*\*(.*?)\*\*/g, '*$1*')  // Convert **bold** to *bold*
    .replace(/__(.*?)__/g, '_$1_')      // Convert __italic__ to _italic_
    .replace(/~~(.*?)~~/g, '~$1~');     // Keep strikethrough
}

function formatTelegramText(text: string): string {
  // Telegram supports HTML and Markdown
  return text; // Can be enhanced with specific Telegram formatting
}

function formatDiscordText(text: string): string {
  // Discord uses markdown-like formatting
  return text; // Already compatible with most markdown
}

function formatSlackText(text: string): string {
  // Slack uses its own formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, '*$1*')  // Convert **bold** to *bold*
    .replace(/__(.*?)__/g, '_$1_')      // Convert __italic__ to _italic_
    .replace(/`(.*?)`/g, '`$1`');       // Keep code formatting
}

export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '')  // Remove potential HTML tags
    .trim();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function formatButtons(buttons: MessageButton[], platform: string): MessageButton[] {
  return buttons.map(button => ({
    ...button,
    text: truncateText(button.text, getButtonTextLimit(platform))
  }));
}

function getButtonTextLimit(platform: string): number {
  switch (platform) {
    case 'whatsapp':
      return 20;
    case 'telegram':
      return 64;
    case 'discord':
      return 80;
    case 'slack':
      return 75;
    default:
      return 50;
  }
}

export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const hashtags: string[] = [];
  let match;
  
  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1]);
  }
  
  return hashtags;
} 