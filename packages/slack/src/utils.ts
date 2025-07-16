import { 
  Message, 
  TextMessage, 
  MediaMessage, 
  InteractiveMessage, 
  LocationMessage, 
  ContactMessage,
  SystemMessage 
} from '@romeo/core';
import { Block, KnownBlock } from '@slack/web-api';
import { SlackMessageOptions, SlackEvent, SlackMessageEvent } from './types.js';

export function convertToSlackMessage(message: Message): SlackMessageOptions {
  const baseMessage: SlackMessageOptions = {
    channel: message.conversationId,
  };

  switch (message.type) {
    case 'text':
      const textMsg = message as TextMessage;
      return {
        ...baseMessage,
        text: textMsg.content,
        thread_ts: message.metadata?.threadTs,
        unfurl_links: message.metadata?.unfurl_links !== false,
        unfurl_media: message.metadata?.unfurl_media !== false,
      };

    case 'interactive':
      const interactiveMsg = message as InteractiveMessage;
      return {
        ...baseMessage,
        text: interactiveMsg.metadata?.fallbackText || 'Interactive message',
        blocks: createSlackBlocks(interactiveMsg),
        thread_ts: message.metadata?.threadTs,
      };

    case 'image':
    case 'video':
    case 'audio':
    case 'file':
      // Media messages are handled separately via files.upload
      const mediaMsg = message as MediaMessage;
      return {
        ...baseMessage,
        text: mediaMsg.caption || `${message.type} file`,
        thread_ts: message.metadata?.threadTs,
      };

    default:
      // Fallback to text message
      return {
        ...baseMessage,
        text: `Unsupported message type: ${(message as any).type}`,
      };
  }
}

export function convertFromSlackMessage(
  slackEvent: SlackEvent,
  messageTs: string
): Message {
  const messageEvent = slackEvent as SlackMessageEvent;
  
  const baseMessage = {
    id: messageTs,
    platform: 'slack' as const,
    conversationId: messageEvent.channel,
    userId: messageEvent.user,
    role: messageEvent.bot_id ? 'assistant' as const : 'user' as const,
    timestamp: new Date(parseFloat(messageTs) * 1000),
    metadata: {
      threadTs: messageEvent.thread_ts,
      teamId: messageEvent.team,
      channelType: messageEvent.channel_type,
      botId: messageEvent.bot_id,
      appId: messageEvent.app_id,
      edited: messageEvent.edited,
      replyCount: messageEvent.reply_count,
    },
  };

  // Handle different message subtypes
  if (messageEvent.subtype) {
    return {
      ...baseMessage,
      type: 'system',
      event: mapSlackSubtypeToSystemEvent(messageEvent.subtype),
      content: messageEvent.text || `${messageEvent.subtype} event`,
    } as SystemMessage;
  }

  // Handle messages with files
  if (messageEvent.files && messageEvent.files.length > 0) {
    const file = messageEvent.files[0];
    return {
      ...baseMessage,
      type: getMediaTypeFromMimeType(file.mimetype),
      mediaUrl: file.url_private,
      mimeType: file.mimetype,
      caption: messageEvent.text,
      fileSize: file.size,
      metadata: {
        ...baseMessage.metadata,
        fileId: file.id,
        filename: file.name,
        title: file.title,
        permalink: file.permalink,
      },
    } as MediaMessage;
  }

  // Handle interactive messages (blocks)
  if (messageEvent.blocks && messageEvent.blocks.length > 0) {
    return {
      ...baseMessage,
      type: 'interactive',
      buttons: extractButtonsFromBlocks(messageEvent.blocks),
      quickReplies: extractQuickRepliesFromBlocks(messageEvent.blocks),
      metadata: {
        ...baseMessage.metadata,
        blocks: messageEvent.blocks,
        fallbackText: messageEvent.text,
      },
    } as InteractiveMessage;
  }

  // Default to text message
  return {
    ...baseMessage,
    type: 'text',
    content: messageEvent.text || '',
  } as TextMessage;
}

export function createSlackBlocks(message: InteractiveMessage): (KnownBlock | Block)[] {
  const blocks: (KnownBlock | Block)[] = [];

  // Add text section if available
  if (message.metadata?.text) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: message.metadata.text,
      },
    });
  }

  // Add buttons as actions block
  if (message.buttons && message.buttons.length > 0) {
    const buttonElements = message.buttons.slice(0, 5).map(button => ({
      type: 'button' as const,
      text: {
        type: 'plain_text' as const,
        text: button.text.substring(0, 75), // Slack button text limit
      },
      action_id: button.id,
      value: button.payload || button.id,
      style: undefined,
      url: button.url,
    }));

    blocks.push({
      type: 'actions',
      elements: buttonElements,
    });
  }

  // Add quick replies as select menu
  if (message.quickReplies && message.quickReplies.length > 0) {
    const options = message.quickReplies.slice(0, 100).map(reply => ({
      text: {
        type: 'plain_text' as const,
        text: reply.text.substring(0, 75),
      },
      value: reply.payload || reply.id,
    }));

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Choose an option:',
      },
      accessory: {
        type: 'static_select',
        placeholder: {
          type: 'plain_text',
          text: 'Select an option',
        },
        options: options,
        action_id: 'quick_reply_select',
      },
    });
  }

  // Add carousel as multiple sections (Slack doesn't have true carousels)
  if (message.carousel && message.carousel.length > 0) {
    message.carousel.slice(0, 10).forEach((item, index) => {
      const sectionBlock: any = {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${item.title}*${item.subtitle ? `\n${item.subtitle}` : ''}`,
        },
      };

      if (item.imageUrl) {
        sectionBlock.accessory = {
          type: 'image',
          image_url: item.imageUrl,
          alt_text: item.title,
        };
      }

      blocks.push(sectionBlock);

      // Add buttons for this carousel item
      if (item.buttons && item.buttons.length > 0) {
        const carouselButtons = item.buttons.slice(0, 5).map(button => ({
          type: 'button' as const,
          text: {
            type: 'plain_text' as const,
            text: button.text.substring(0, 75),
          },
          action_id: `${button.id}_${index}`,
          value: button.payload || button.id,
          url: button.url,
        }));

        blocks.push({
          type: 'actions',
          elements: carouselButtons,
        });
      }

      // Add divider between carousel items
      if (message.carousel && index < message.carousel.length - 1) {
        blocks.push({ type: 'divider' });
      }
    });
  }

  return blocks;
}

function mapSlackSubtypeToSystemEvent(subtype: string): string {
  switch (subtype) {
    case 'channel_join':
    case 'group_join':
      return 'user_joined';
    case 'channel_leave':
    case 'group_leave':
      return 'user_left';
    case 'channel_topic':
    case 'channel_purpose':
    case 'group_topic':
    case 'group_purpose':
      return 'conversation_started';
    default:
      return 'conversation_started';
  }
}

function getMediaTypeFromMimeType(mimeType: string): 'image' | 'video' | 'audio' | 'file' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'file';
}

function extractButtonsFromBlocks(blocks: (KnownBlock | Block)[]): Array<{ id: string; text: string; payload?: string; url?: string; }> {
  const buttons: Array<{ id: string; text: string; payload?: string; url?: string; }> = [];
  
  blocks.forEach(block => {
    if (block.type === 'actions' && 'elements' in block) {
      block.elements?.forEach(element => {
        if (element.type === 'button' && 'action_id' in element && element.action_id) {
          buttons.push({
            id: element.action_id,
            text: 'text' in element && element.text && 'text' in element.text ? element.text.text : 'Button',
            payload: 'value' in element ? element.value as string : undefined,
            url: 'url' in element ? element.url as string : undefined,
          });
        }
      });
    }
  });
  
  return buttons;
}

function extractQuickRepliesFromBlocks(blocks: (KnownBlock | Block)[]): Array<{ id: string; text: string; payload?: string; }> {
  const quickReplies: Array<{ id: string; text: string; payload?: string; }> = [];
  
  blocks.forEach(block => {
    if (block.type === 'section' && 'accessory' in block && block.accessory?.type === 'static_select') {
      const select = block.accessory;
      if ('options' in select && select.options) {
        select.options.forEach((option: any) => {
          quickReplies.push({
            id: option.value,
            text: option.text.text,
            payload: option.value,
          });
        });
      }
    }
  });
  
  return quickReplies;
}

export function formatSlackText(text: string): string {
  // Convert common markdown to Slack's mrkdwn format
  return text
    .replace(/\*\*(.*?)\*\*/g, '*$1*')        // Bold: **text** -> *text*
    .replace(/__(.*?)__/g, '_$1_')            // Italic: __text__ -> _text_
    .replace(/~~(.*?)~~/g, '~$1~')            // Strikethrough: ~~text~~ -> ~text~
    .replace(/`([^`]+)`/g, '`$1`')            // Code: `text` -> `text` (no change)
    .replace(/```([^```]+)```/g, '```$1```'); // Code block: ```text``` -> ```text``` (no change)
}

export function sanitizeSlackText(text: string): string {
  return text
    .replace(/[<>&]/g, (match) => {
      switch (match) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        default: return match;
      }
    })
    .trim();
}

export function extractSlackMentions(text: string): string[] {
  const mentionRegex = /<@([UW][A-Z0-9]+)(?:\|([^>]+))?>/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

export function extractSlackChannelMentions(text: string): string[] {
  const channelRegex = /<#([CG][A-Z0-9]+)(?:\|([^>]+))?>/g;
  const channels: string[] = [];
  let match;
  
  while ((match = channelRegex.exec(text)) !== null) {
    channels.push(match[1]);
  }
  
  return channels;
}

export function parseSlackTimestamp(ts: string): Date {
  return new Date(parseFloat(ts) * 1000);
}

export function createSlackTimestamp(date: Date = new Date()): string {
  return (date.getTime() / 1000).toString();
} 