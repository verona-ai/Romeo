import { Platform, PlatformConfig, PlatformCapabilities } from '../types/platform.js';
import { Message, TextMessage, MediaMessage } from '../types/message.js';
import { User } from '../types/user.js';
import { Conversation } from '../types/conversation.js';

export abstract class BasePlatformClient {
  protected config: PlatformConfig;
  protected capabilities: PlatformCapabilities;

  constructor(config: PlatformConfig) {
    this.config = config;
    this.capabilities = this.getPlatformCapabilities();
  }

  abstract getPlatformCapabilities(): PlatformCapabilities;
  
  // Message operations
  abstract sendMessage(message: Message): Promise<{ messageId: string }>;
  abstract sendTextMessage(conversationId: string, text: string, metadata?: Record<string, any>): Promise<{ messageId: string }>;
  abstract sendMediaMessage(message: MediaMessage): Promise<{ messageId: string }>;
  
  // User operations
  abstract getUserProfile(userId: string): Promise<User | null>;
  abstract getConversation(conversationId: string): Promise<Conversation | null>;
  
  // Webhook operations
  abstract setupWebhook(webhookUrl: string): Promise<boolean>;
  abstract removeWebhook(): Promise<boolean>;
  abstract verifyWebhook(signature: string, payload: string): boolean;
  
  // Connection management
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract isConnected(): boolean;
  
  // Platform-specific features
  abstract sendTypingIndicator?(conversationId: string): Promise<void>;
  abstract markAsRead?(conversationId: string, messageId: string): Promise<void>;
  
  // Utility methods
  getPlatform(): Platform {
    return this.config.platform;
  }
  
  getCapabilities(): PlatformCapabilities {
    return this.capabilities;
  }
  
  supportsFeature(feature: keyof PlatformCapabilities): boolean {
    return this.capabilities[feature];
  }
  
  protected validateMessage(message: Message): void {
    if (!message.id) throw new Error('Message ID is required');
    if (!message.conversationId) throw new Error('Conversation ID is required');
    if (!message.userId) throw new Error('User ID is required');
    if (message.platform !== this.config.platform) {
      throw new Error(`Message platform ${message.platform} does not match client platform ${this.config.platform}`);
    }
  }
  
  protected async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt === maxRetries) break;
        
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError!;
  }
  
  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logData = data ? { message, data, platform: this.config.platform } : { message, platform: this.config.platform };
    
    console[level](`[${timestamp}] [${this.config.platform.toUpperCase()}]`, logData);
  }
} 