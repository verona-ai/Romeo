# Romeo 🤖

⭐ **Star this repo if you want to build chat platform integrations without complexity!**

### Open-Source Chat Platform Integration Packages for AI Agents

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)](https://slack.com/)
[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://telegram.org/)
[![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://business.whatsapp.com/)

Romeo is a collection of **open-source TypeScript packages** that provide seamless integrations with popular chat platforms. Build your private AI agent and use these packages to connect with Slack, Telegram, Discord, WhatsApp, and more — all with **full TypeScript support**.

---

## 🎯 Why Romeo?

### ✨ For AI Agent Builders
- **Private Cloud Ready**: Keep your AI agent proprietary while using open-source integrations
- **TypeScript First**: Built on official platform SDKs with comprehensive type definitions
- **Platform Agnostic**: Same interface across all chat platforms
- **Production Ready**: Battle-tested webhook handling, rate limiting, and error recovery

### 🚀 Developer Experience First
```bash
# Install the packages you need
npm install @romeo/core @romeo/slack
# Start building immediately with full TypeScript IntelliSense
```

### 📦 Modular Architecture
- **@romeo/core**: Shared types and utilities
- **@romeo/slack**: Slack Bot API integration (TypeScript-first)
- **@romeo/telegram**: Telegram Bot API integration
- **@romeo/discord**: Discord Bot integration
- **@romeo/whatsapp**: WhatsApp Business API integration
- **@romeo/messenger**: Facebook Messenger integration
- **@romeo/instagram**: Instagram Direct Messages

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Your Private AI Agent"
        A[AI Agent Core]
        A --> B[Message Router]
        A --> C[Conversation Memory]
        A --> D[Business Logic]
    end

    subgraph "Romeo Packages (Open Source)"
        E[@romeo/core<br/>Types & Utilities]
        F[@romeo/slack<br/>Slack Integration]
        G[@romeo/telegram<br/>Telegram Integration]
        H[@romeo/discord<br/>Discord Integration]
        I[@romeo/whatsapp<br/>WhatsApp Integration]
    end

    subgraph "Chat Platforms"
        J[Slack Workspace]
        K[Telegram]
        L[Discord]
        M[WhatsApp Business]
    end

    B --> E
    B --> F
    B --> G
    B --> H
    B --> I

    F --> J
    G --> K
    H --> L
    I --> M
```

---

## 🚀 Quick Start

### 1. Install Core Package

```bash
npm install @romeo/core
```

### 2. Choose Your Platforms

```bash
# Slack Bot API (Recommended - Full TypeScript Support)
npm install @romeo/slack

# Telegram Bot API
npm install @romeo/telegram

# Discord Bot
npm install @romeo/discord

# WhatsApp Business API
npm install @romeo/whatsapp
```

### 3. Basic Usage (Slack Example)

```typescript
import { SlackClient, SlackWebhookHandler, blockKit } from '@romeo/slack';
import { Message } from '@romeo/core';

// Configure Slack client with full TypeScript support
const slack = new SlackClient({
  platform: 'slack',
  credentials: {
    botToken: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  }
});

// Handle incoming messages with rich Block Kit support
const webhookHandler = new SlackWebhookHandler();

webhookHandler.onMessageReceived = async (event) => {
  const message = event.message;
  
  // Your AI agent logic here
  const response = await yourAIAgent.process(message);
  
  // Send rich interactive response using Block Kit
  const blocks = blockKit.builder()
    .header('🤖 AI Response')
    .section(response)
    .buttons([
      { text: 'Get Help', actionId: 'help', style: 'primary' },
      { text: 'Try Again', actionId: 'retry' }
    ])
    .build();

  await slack.sendInteractiveMessage(message.conversationId, {
    id: `ai_response_${Date.now()}`,
    platform: 'slack',
    conversationId: message.conversationId,
    userId: 'ai_assistant',
    type: 'interactive',
    role: 'assistant',
    timestamp: new Date(),
    metadata: { blocks }
  });
};
```

---

## 📋 Available Packages

### Core Package
| Package | Status | Description |
|---------|--------|-------------|
| `@romeo/core` | ✅ Ready | Shared types, utilities, and base classes |

### Platform Integrations
| Package | Platform | Status | TypeScript Support | Features |
|---------|----------|--------|------------------|----------|
| `@romeo/slack` | Slack | ✅ Ready | 🟢 **Full** (Official SDK) | Block Kit, Events API, Interactive Components, Modals |
| `@romeo/telegram` | Telegram | 🚧 Coming Soon | 🟢 **Full** (Official SDK) | Bot API, Inline Keyboards, File Handling, Webhooks |
| `@romeo/discord` | Discord | 🚧 Coming Soon | 🟢 **Full** (Official SDK) | Slash Commands, Embeds, Voice Channels, Interactions |
| `@romeo/whatsapp` | WhatsApp Business | 🚧 Coming Soon | 🟡 **Partial** (Community) | Text, Media, Interactive Messages, Webhooks |
| `@romeo/messenger` | Facebook Messenger | 🚧 Coming Soon | 🟡 **Partial** (Community) | Quick Replies, Templates, Personas, Webhooks |
| `@romeo/instagram` | Instagram DM | 🚧 Coming Soon | 🟡 **Partial** (Community) | Stories, Direct Messages, Media |

**Note**: We prioritize platforms with official TypeScript SDKs for the best developer experience.

---

## 💡 Features

### 🌐 Unified Interface
All platforms implement the same core interface:
```typescript
interface PlatformClient {
  sendMessage(message: Message): Promise<{ messageId: string }>;
  sendTextMessage(conversationId: string, text: string): Promise<{ messageId: string }>;
  getUserProfile(userId: string): Promise<User | null>;
  setupWebhook(webhookUrl: string): Promise<boolean>;
}
```

### 🔒 Secure Webhook Handling
- **Signature Verification**: Cryptographic verification using platform-specific methods
- **Rate Limiting**: Built-in protection against spam and abuse
- **Error Recovery**: Automatic retry mechanisms and graceful degradation
- **TypeScript Validation**: Runtime type checking with Zod schemas

### 🎨 Rich Message Types
- **Text Messages**: With platform-specific formatting (mrkdwn, markdown, etc.)
- **Media Messages**: Images, videos, audio, documents with type validation
- **Interactive Messages**: Buttons, quick replies, carousels with Block Kit support
- **Location & Contact**: Geolocation and contact sharing
- **System Events**: Typing indicators, read receipts, user activity

### 📊 Comprehensive Logging
- **Structured Logging**: JSON-formatted logs for easy parsing
- **Error Tracking**: Detailed error reporting with full context
- **Performance Metrics**: Request timing and success rates
- **Debug Support**: Comprehensive debugging utilities

---

## 📖 Examples

### Slack Bot with Block Kit

```typescript
import express from 'express';
import { SlackClient, SlackWebhookHandler, blockKit } from '@romeo/slack';

const app = express();
const client = new SlackClient(config);
const handler = new SlackWebhookHandler();

// Rich interactive messages with TypeScript autocomplete
handler.onMessageReceived = async (event) => {
  if (event.message.type === 'text') {
    const blocks = blockKit.builder()
      .header('🎉 Welcome!')
      .section('What would you like to do today?')
      .staticSelect('Choose an action', 'main_menu', [
        { text: 'Get Started', value: 'start' },
        { text: 'View Help', value: 'help' },
        { text: 'Contact Support', value: 'support' }
      ])
      .build();

    await client.sendInteractiveMessage(event.message.conversationId, {
      // Fully typed message object
      id: `welcome_${Date.now()}`,
      platform: 'slack',
      conversationId: event.message.conversationId,
      userId: 'bot',
      type: 'interactive',
      role: 'assistant',
      timestamp: new Date(),
      metadata: { blocks }
    });
  }
};

// Handle interactive components
app.post('/slack/interactive', async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  
  if (payload.actions?.[0]?.action_id === 'main_menu') {
    const selectedValue = payload.actions[0].selected_option?.value;
    
    switch (selectedValue) {
      case 'start':
        await client.sendTextMessage(
          payload.channel.id,
          '🚀 Let\'s get started! Here\'s what you can do...'
        );
        break;
      case 'help':
        await client.sendTextMessage(
          payload.channel.id,
          '📚 Here\'s our comprehensive help guide...'
        );
        break;
    }
  }
  
  res.sendStatus(200);
});
```

### Multi-Platform AI Agent

```typescript
import { SlackClient } from '@romeo/slack';
import { TelegramClient } from '@romeo/telegram';
import { Message } from '@romeo/core';

class MultiPlatformAgent {
  private platforms = new Map();

  constructor() {
    this.platforms.set('slack', new SlackClient(slackConfig));
    this.platforms.set('telegram', new TelegramClient(telegramConfig));
  }

  async processMessage(message: Message) {
    // Your AI logic here with full type safety
    const response = await this.generateResponse(message);
    
    // Send response via appropriate platform
    const client = this.platforms.get(message.platform);
    
    if (message.platform === 'slack') {
      // Use Slack-specific features like Block Kit
      const blocks = blockKit.builder()
        .section(response)
        .buttons([
          { text: 'Helpful', actionId: 'feedback_helpful', style: 'primary' },
          { text: 'Try Again', actionId: 'regenerate' }
        ])
        .build();
        
      await client.sendInteractiveMessage(message.conversationId, {
        // TypeScript ensures all required fields are present
        id: `ai_${Date.now()}`,
        platform: 'slack',
        conversationId: message.conversationId,
        userId: 'ai_assistant',
        type: 'interactive',
        role: 'assistant',
        timestamp: new Date(),
        metadata: { blocks }
      });
    } else {
      // Fallback to simple text for other platforms
      await client.sendTextMessage(message.conversationId, response);
    }
  }
}
```

---

## 🛠️ Development

### Project Structure
```
romeo/
├── packages/                 # All Romeo packages
│   ├── core/                # Core types and utilities
│   ├── slack/               # Slack integration (TypeScript-first)
│   ├── telegram/            # Telegram integration  
│   ├── discord/             # Discord integration
│   └── whatsapp/            # WhatsApp integration
└── examples/                # Example implementations
    ├── basic-slack-bot/     # Feature-rich Slack bot with Block Kit
    ├── multi-platform-agent/# Multi-platform AI agent
    └── ai-customer-service/ # Customer service bot
```

### Development Commands
```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests with type checking
pnpm test

# Start development mode with hot reload
pnpm dev

# Lint TypeScript code
pnpm lint

# Type check all packages
pnpm type-check
```

---

## 🌟 Use Cases

### ✅ Perfect For:

- **AI Agent Platforms**: Integrate multiple chat platforms with full type safety
- **Customer Service Bots**: Handle support across Slack, Telegram, Discord
- **Internal Tools**: Company bots with rich interactive components
- **Marketing Automation**: Multi-channel campaign management with analytics
- **E-commerce**: Shopping assistants with native platform features

### 🔄 Enterprise Ready:

- **Scalable Architecture**: Handle thousands of concurrent conversations
- **TypeScript Everywhere**: Catch errors at compile time, not runtime
- **Monitoring & Analytics**: Built-in metrics and structured logging
- **Security First**: Webhook verification, rate limiting, data protection
- **Multi-tenant**: Support multiple brands/clients with isolated configurations

---

## 🤝 Contributing

We welcome contributions! Whether you want to:

- 🐛 Fix bugs or improve existing integrations
- 🚀 Add new platform integrations (prioritizing TypeScript support)
- 📚 Improve documentation and examples
- 💡 Suggest new features or architectural improvements

### Quick Contribution Guide:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/platform-integration`
3. Make your changes with full TypeScript support
4. Add comprehensive tests: `pnpm test`
5. Submit a pull request

### Adding New Platform Integration:

1. **Check TypeScript Support**: Prioritize platforms with official TypeScript SDKs
2. **Create Package**: `packages/platform-name/`
3. **Implement Interfaces**: Extend `BasePlatformClient` and `BaseWebhookHandler`
4. **Add Type Definitions**: Comprehensive TypeScript types for all platform features
5. **Write Tests**: Unit and integration tests with type checking
6. **Create Examples**: Working example in `examples/`
7. **Update Documentation**: README and API docs

### TypeScript Integration Standards:

- Use official platform SDKs when available
- Provide comprehensive type definitions for all API responses
- Include JSDoc comments for all public methods
- Validate runtime types with Zod schemas
- Export platform-specific types for advanced usage

---

## 📞 Support & Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/your-org/romeo/issues)
- **Discord**: [Join our developer community](https://discord.gg/romeo)
- **Documentation**: [Full API documentation](https://docs.romeo.dev)
- **TypeScript Guide**: [Advanced TypeScript patterns](https://docs.romeo.dev/typescript)
- **Email**: hello@romeo.dev

---

## 📄 License

MIT License - use it, modify it, ship it! See [LICENSE](LICENSE) for details.

---

## 🙏 Built With

- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript at scale
- **[Slack SDK](https://slack.dev/node-slack-sdk/)** - Official Slack TypeScript SDK
- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[tsup](https://tsup.egoist.dev/)** - Bundle TypeScript libraries with zero config
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

---

<div align="center">

**⭐ Star this repo if it helped you build better chat integrations!**

**[⬆ Back to Top](#romeo-)**

Made with ❤️ by developers who believe in TypeScript-first development

[GitHub](https://github.com/your-org/romeo) • [Documentation](https://docs.romeo.dev) • [Discord](https://discord.gg/romeo) • [Examples](./examples/) • [TypeScript Guide](https://docs.romeo.dev/typescript)

</div>
