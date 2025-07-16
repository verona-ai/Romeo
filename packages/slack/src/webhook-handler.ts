import { createHmac } from 'crypto';
import { WebhookHandler } from '@romeo/core';
import { 
  SlackEventCallback, 
  SlackMessageEvent, 
  SlackInteractivePayload,
  SlackSlashCommand 
} from './types.js';
import { convertFromSlackMessage } from './utils.js';

export class SlackWebhookHandler implements WebhookHandler {
  private signingSecret: string;
  private messageCallbacks: Array<(message: SlackMessageEvent) => Promise<void> | void> = [];
  private interactionCallbacks: Array<(payload: SlackInteractivePayload) => Promise<void> | void> = [];
  private commandCallbacks: Array<(command: SlackSlashCommand) => Promise<void> | void> = [];

  constructor(signingSecret: string) {
    this.signingSecret = signingSecret;
  }

  async handleWebhook(payload: any, headers: Record<string, string>): Promise<any> {
    const timestamp = headers['x-slack-request-timestamp'];
    const signature = headers['x-slack-signature'];

    if (!this.verifySignature(payload, signature, this.signingSecret)) {
      throw new Error('Invalid signature');
    }

    const parsedPayload = typeof payload === 'string' ? JSON.parse(payload) : payload;

    // Handle URL verification (required for Slack app setup)
    if (parsedPayload.type === 'url_verification') {
      return { challenge: parsedPayload.challenge };
    }

    // Handle Events API
    if (parsedPayload.type === 'event_callback') {
      await this.handleEventCallback(parsedPayload);
      return { ok: true };
    }

    // Handle Interactive Components
    if (parsedPayload.type === 'interactive_message' || parsedPayload.type === 'block_actions') {
      await this.handleInteractive(parsedPayload);
      return { ok: true };
    }

    // Handle Slash Commands
    if (parsedPayload.command) {
      await this.handleSlashCommand(parsedPayload);
      return { ok: true };
    }

    return { ok: true };
  }

  verifySignature(payload: string, signature: string, secret: string): boolean {
    if (!signature || !payload) return false;

    const [version, hash] = signature.split('=');
    if (version !== 'v0') return false;

    const hmac = createHmac('sha256', secret);
    hmac.update(payload);
    const computedHash = hmac.digest('hex');

    return computedHash === hash;
  }

  onMessage(callback: (message: SlackMessageEvent) => Promise<void> | void): void {
    this.messageCallbacks.push(callback);
  }

  onInteraction(callback: (payload: SlackInteractivePayload) => Promise<void> | void): void {
    this.interactionCallbacks.push(callback);
  }

  onSlashCommand(callback: (command: SlackSlashCommand) => Promise<void> | void): void {
    this.commandCallbacks.push(callback);
  }

  private async handleEventCallback(payload: any): Promise<void> {
    const event = payload.event;

    if (event.type === 'message' && !event.bot_id) {
      const slackMessage: SlackMessageEvent = {
        type: 'message',
        channel: event.channel,
        user: event.user,
        text: event.text || '',
        ts: event.ts,
        thread_ts: event.thread_ts,
      };

      for (const callback of this.messageCallbacks) {
        try {
          await callback(slackMessage);
        } catch (error) {
          console.error('Error in message callback:', error);
        }
      }
    }
  }

  private async handleInteractive(payload: SlackInteractivePayload): Promise<void> {
    for (const callback of this.interactionCallbacks) {
      try {
        await callback(payload);
      } catch (error) {
        console.error('Error in interaction callback:', error);
      }
    }
  }

  private async handleSlashCommand(command: SlackSlashCommand): Promise<void> {
    for (const callback of this.commandCallbacks) {
      try {
        await callback(command);
      } catch (error) {
        console.error('Error in slash command callback:', error);
      }
    }
  }
} 