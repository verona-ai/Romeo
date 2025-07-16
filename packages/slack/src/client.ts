import { 
  PlatformClient, 
  ChatMessage, 
  ChatUser, 
  ChatChannel,
  MessageOptions
} from '@romeo/core';
import { WebClient, Block, KnownBlock, LogLevel } from '@slack/web-api';
import { 
  SlackConfig, 
  SlackMessageOptions, 
  SlackPostMessageResponse,
  SlackUserInfo,
  SlackConversationInfo,
  SlackFile 
} from './types.js';

export class SlackClient implements PlatformClient {
  private slack: WebClient;
  public config: SlackConfig;

  constructor(config: SlackConfig) {
    this.config = config;
    
    this.slack = new WebClient(config.credentials.botToken, {
      logLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
    });
  }

  private log(level: string, message: string, data?: any): void {
    console.log(`[${level.toUpperCase()}] SlackClient: ${message}`, data || '');
  }

  async sendMessage(channelId: string, message: MessageOptions): Promise<ChatMessage> {
    const options: any = {
      channel: channelId,
      text: message.text || 'Message',
      ...message.metadata
    };

    const response = await this.slack.chat.postMessage(options) as SlackPostMessageResponse;

    if (!response.ok) {
      throw new Error(`Slack API Error: ${response.error}`);
    }

    this.log('info', 'Message sent', { channelId, messageId: response.ts });
    
    return {
      id: response.ts!,
      text: message.text || '',
      userId: 'bot',
      channelId,
      timestamp: new Date(),
      metadata: message.metadata
    };
  }

  async getUser(userId: string): Promise<ChatUser> {
    const response = await this.slack.users.info({ user: userId }) as SlackUserInfo;
    
    if (!response.ok) {
      throw new Error(`Failed to get user: ${response.error}`);
    }

    const slackUser = response.user;
    
    return {
      id: slackUser.id,
      username: slackUser.name,
      displayName: slackUser.real_name || slackUser.name,
      email: slackUser.profile?.email,
      avatar: slackUser.profile?.image_192,
      metadata: { teamId: slackUser.team_id }
    };
  }

  async getChannel(channelId: string): Promise<ChatChannel> {
    const response = await this.slack.conversations.info({ 
      channel: channelId 
    }) as SlackConversationInfo;
    
    if (!response.ok) {
      throw new Error(`Failed to get channel: ${response.error}`);
    }

    const channel = response.channel;
    
    return {
      id: channel.id,
      name: channel.name || 'Direct Message',
      type: channel.is_im ? 'direct' : channel.is_private ? 'private' : 'public',
      memberCount: channel.members?.length,
      metadata: {
        isChannel: channel.is_channel,
        isPrivate: channel.is_private,
        topic: channel.topic?.value
      }
    };
  }

  onMessage(callback: (event: any) => Promise<void> | void): void {
    // This would typically be implemented with webhook handling
    this.log('info', 'Message callback registered');
  }

  // Slack-specific helper methods
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.slack.auth.test();
      
      if (!response.ok) {
        throw new Error(`Slack auth failed: ${response.error}`);
      }
      
      this.log('info', 'Connected to Slack', {
        teamId: response.team_id,
        teamName: response.team,
        userId: response.user_id,
        botId: response.bot_id,
      });
      
      return true;
    } catch (error) {
      this.log('error', 'Failed to connect to Slack', { error });
      return false;
    }
  }

  async sendTextMessage(channelId: string, text: string): Promise<string> {
    const response = await this.slack.chat.postMessage({
      channel: channelId,
      text
    });

    if (!response.ok) {
      throw new Error(`Slack API Error: ${response.error}`);
    }

    return response.ts!;
  }

  async sendBlockMessage(channelId: string, text: string, blocks: (Block | KnownBlock)[]): Promise<string> {
    const response = await this.slack.chat.postMessage({
      channel: channelId,
      text,
      blocks
    });

    if (!response.ok) {
      throw new Error(`Slack API Error: ${response.error}`);
    }

    return response.ts!;
  }
} 