import { WebhookEvent, WebhookHandler } from '../types/webhook.js';
import { Platform } from '../types/platform.js';

export abstract class BaseWebhookHandler implements WebhookHandler {
  protected platform: Platform;
  protected secret?: string;

  constructor(platform: Platform, secret?: string) {
    this.platform = platform;
    this.secret = secret;
  }

  abstract handleEvent(event: WebhookEvent): Promise<void>;
  abstract verifyWebhook?(signature: string, body: string): boolean;
  abstract parseWebhookPayload(payload: any): WebhookEvent[];

  // Event handlers (can be overridden by platform implementations)
  protected async onMessageReceived(event: WebhookEvent): Promise<void> {
    this.log('info', 'Message received', { event });
  }

  protected async onMessageDelivered(event: WebhookEvent): Promise<void> {
    this.log('info', 'Message delivered', { event });
  }

  protected async onMessageRead(event: WebhookEvent): Promise<void> {
    this.log('info', 'Message read', { event });
  }

  protected async onUserTyping(event: WebhookEvent): Promise<void> {
    this.log('info', 'User typing', { event });
  }

  protected async onUserJoined(event: WebhookEvent): Promise<void> {
    this.log('info', 'User joined', { event });
  }

  protected async onUserLeft(event: WebhookEvent): Promise<void> {
    this.log('info', 'User left', { event });
  }

  protected async onConversationStarted(event: WebhookEvent): Promise<void> {
    this.log('info', 'Conversation started', { event });
  }

  protected async onConversationEnded(event: WebhookEvent): Promise<void> {
    this.log('info', 'Conversation ended', { event });
  }

  protected async onWebhookVerified(event: WebhookEvent): Promise<void> {
    this.log('info', 'Webhook verified', { event });
  }

  // Utility methods
  protected async processEvents(events: WebhookEvent[]): Promise<void> {
    for (const event of events) {
      try {
        await this.handleEvent(event);
      } catch (error) {
        this.log('error', 'Error processing event', { event, error });
      }
    }
  }

  protected async routeEvent(event: WebhookEvent): Promise<void> {
    switch (event.type) {
      case 'message_received':
        await this.onMessageReceived(event);
        break;
      case 'message_delivered':
        await this.onMessageDelivered(event);
        break;
      case 'message_read':
        await this.onMessageRead(event);
        break;
      case 'user_typing':
        await this.onUserTyping(event);
        break;
      case 'user_joined':
        await this.onUserJoined(event);
        break;
      case 'user_left':
        await this.onUserLeft(event);
        break;
      case 'conversation_started':
        await this.onConversationStarted(event);
        break;
      case 'conversation_ended':
        await this.onConversationEnded(event);
        break;
      case 'webhook_verified':
        await this.onWebhookVerified(event);
        break;
      default:
        this.log('warn', 'Unknown event type', { event });
    }
  }

  protected generateEventId(): string {
    return `${this.platform}_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logData = data ? { message, data, platform: this.platform } : { message, platform: this.platform };
    
    console[level](`[${timestamp}] [${this.platform.toUpperCase()}_WEBHOOK]`, logData);
  }

  // Error handling
  protected handleError(error: Error, context?: any): void {
    this.log('error', 'Webhook handler error', { error: error.message, context });
    
    // Can be extended with error reporting, metrics, etc.
  }

  // Rate limiting helpers
  protected async checkRateLimit(identifier: string): Promise<boolean> {
    // Implement rate limiting logic based on platform requirements
    // This is a placeholder - real implementation would use Redis or similar
    return true;
  }

  protected async handleRateLimitExceeded(identifier: string): Promise<void> {
    this.log('warn', 'Rate limit exceeded', { identifier });
    // Handle rate limiting (delay, queue, etc.)
  }
} 