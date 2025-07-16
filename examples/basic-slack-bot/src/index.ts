import express from 'express';
import { SlackClient, SlackWebhookHandler, SlackConfig, blockKit } from '@romeo/slack';
import { Message } from '@romeo/core';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Slack configuration
const slackConfig: SlackConfig = {
  platform: 'slack',
  credentials: {
    botToken: process.env.SLACK_BOT_TOKEN!,
    signingSecret: process.env.SLACK_SIGNING_SECRET!,
    appToken: process.env.SLACK_APP_TOKEN, // For Socket Mode (optional)
  },
  socketMode: false, // Set to true if using Socket Mode instead of HTTP
};

// Initialize Slack client and webhook handler
const slackClient = new SlackClient(slackConfig);
const webhookHandler = new SlackWebhookHandler(slackConfig.credentials.signingSecret);

// Custom webhook handler that processes messages
class CustomSlackHandler extends SlackWebhookHandler {
  protected async onMessageReceived(event: any): Promise<void> {
    const message = event.message as Message;
    
    console.log('Received Slack message:', {
      from: message.userId,
      channel: message.conversationId,
      type: message.type,
      content: message.type === 'text' ? (message as any).content : 'media/interactive'
    });

    // Skip messages from bots to avoid loops
    if (message.metadata?.botId) {
      return;
    }

    // Simple echo bot with rich responses
    if (message.type === 'text') {
      const textMessage = message as any;
      const content = textMessage.content.toLowerCase();
      
      try {
        if (content.includes('hello') || content.includes('hi')) {
          // Send a rich Block Kit message
          const blocks = blockKit.builder()
            .header('👋 Hello there!')
            .section('Welcome to the Romeo Slack integration demo!')
            .divider()
            .section('What would you like to do?')
            .buttons([
              { text: 'Get Help', actionId: 'help_button', style: 'primary' },
              { text: 'Learn More', actionId: 'learn_button' },
              { text: 'Contact Support', actionId: 'support_button', style: 'danger' }
            ])
            .build();

          await slackClient.sendBlockMessage(message.conversationId, 'Welcome! Choose an option to continue.', blocks);
          
        } else if (content.includes('help')) {
          await slackClient.sendTextMessage(
            message.conversationId,
            `🤖 *Romeo Slack Bot Help*\n\n` +
            `• Say "hello" for a welcome message\n` +
            `• Send any text for an echo response\n` +
            `• Upload files to see file handling\n` +
            `• Mention me with @romeo for special responses\n\n` +
            `Built with Romeo's TypeScript-first Slack integration! 🚀`
          );
          
        } else {
          // Echo the message with formatting
          const response = `🔄 *Echo:* ${textMessage.content}`;
          await slackClient.sendTextMessage(
            message.conversationId, 
            response
          );
        }
        
        console.log('Sent response to Slack');
        
      } catch (error) {
        console.error('Error sending response:', error);
      }
    }
    
    // Handle file uploads
    else if (['image', 'video', 'audio', 'file'].includes(message.type)) {
      await slackClient.sendTextMessage(
        message.conversationId, 
        `📎 Nice ${message.type}! Thanks for sharing. Romeo can handle all types of media files.`
      );
    }
    
    // Handle interactive messages (button clicks, etc.)
    else if (message.type === 'interactive') {
      await slackClient.sendTextMessage(
        message.conversationId,
        `✨ Thanks for interacting! Romeo received your action.`
      );
    }
  }

  // Handle button clicks and interactive components
  async handleInteractiveComponent(payload: any): Promise<void> {
    const action = payload.actions?.[0];
    if (!action) return;

    const { action_id, value } = action;
    const userId = payload.user.id;
    const channelId = payload.channel?.id;

    console.log('Interactive component triggered:', { action_id, value, userId, channelId });

    // Handle different button actions
    switch (action_id) {
      case 'help_button':
        await slackClient.sendTextMessage(
          channelId,
          `🛟 *Help Center*\n\nHere are some helpful resources:\n• Romeo Documentation\n• Slack Integration Guide\n• TypeScript Examples\n\nNeed more help? Just ask!`
        );
        break;
        
      case 'learn_button':
        const learnBlocks = blockKit.builder()
          .header('📚 Learn About Romeo')
          .section('Romeo provides TypeScript-first chat platform integrations:')
          .fields([
            { title: 'Slack Integration', value: 'Full Block Kit support with TypeScript' },
            { title: 'Multi-Platform', value: 'WhatsApp, Telegram, Discord, and more' },
            { title: 'Type-Safe', value: 'Complete TypeScript definitions' },
            { title: 'Production Ready', value: 'Battle-tested webhook handling' }
          ])
          .divider()
          .section('🔗 *Links:*\n• GitHub: github.com/your-org/romeo\n• Documentation: docs.romeo.dev')
          .build();

        await slackClient.sendBlockMessage(channelId, 'Learn more about Romeo chat platform integrations', learnBlocks);
        break;
        
      case 'support_button':
        await slackClient.sendTextMessage(
          channelId,
          `🆘 *Contact Support*\n\n• Discord: discord.gg/romeo\n• Email: hello@romeo.dev\n• GitHub Issues: github.com/your-org/romeo/issues\n\nWe're here to help! 💙`
        );
        break;
    }
  }
}

const customHandler = new CustomSlackHandler(slackConfig.credentials.signingSecret);

// Webhook endpoint for Slack Events API
app.post('/slack/events', async (req, res) => {
  try {
    // Verify webhook signature
    const signature = req.headers['x-slack-signature'] as string;
    const timestamp = req.headers['x-slack-request-timestamp'] as string;
    const body = JSON.stringify(req.body);
    
    if (!customHandler.verifySignature(body, signature, slackConfig.credentials.signingSecret)) {
      console.log('Invalid Slack webhook signature');
      return res.sendStatus(403);
    }

    // Handle URL verification challenge
    if (req.body.type === 'url_verification') {
      console.log('Slack URL verification successful');
      return res.json({ challenge: req.body.challenge });
    }

    // Process webhook events
    await customHandler.handleWebhook(req.body, req.headers as Record<string, string>);

    res.sendStatus(200);
  } catch (error) {
    console.error('Slack webhook error:', error);
    res.sendStatus(500);
  }
});

// Endpoint for interactive components (buttons, menus, etc.)
app.post('/slack/interactive', async (req, res) => {
  try {
    const payload = JSON.parse(req.body.payload);
    
    // Verify webhook signature
    const signature = req.headers['x-slack-signature'] as string;
    const timestamp = req.headers['x-slack-request-timestamp'] as string;
    const body = req.body.payload;
    
    if (!customHandler.verifySignature(body, signature, slackConfig.credentials.signingSecret)) {
      console.log('Invalid Slack interactive signature');
      return res.sendStatus(403);
    }

    await customHandler.handleInteractiveComponent(payload);
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Slack interactive error:', error);
    res.sendStatus(500);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    platform: 'slack',
    timestamp: new Date().toISOString(),
    features: [
      'Events API',
      'Interactive Components', 
      'Block Kit',
      'TypeScript Support'
    ]
  });
});

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test Slack connection
    await slackClient.testConnection();
    console.log('✅ Slack client connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Basic Slack bot running on port ${PORT}`);
      console.log(`📡 Events webhook: http://localhost:${PORT}/slack/events`);
      console.log(`🎛️  Interactive webhook: http://localhost:${PORT}/slack/interactive`);
      console.log('');
      console.log('🔧 Configure these URLs in your Slack App settings:');
      console.log('   • Event Subscriptions: http://your-domain.com/slack/events');
      console.log('   • Interactive Components: http://your-domain.com/slack/interactive');
      console.log('');
      console.log('📋 Required Slack Bot Token Scopes:');
      console.log('   • chat:write (send messages)');
      console.log('   • users:read (get user info)');
      console.log('   • channels:read (get channel info)');
      console.log('   • groups:read (get private channel info)');
      console.log('   • im:read (get DM info)');
      console.log('   • files:read (handle file uploads)');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 