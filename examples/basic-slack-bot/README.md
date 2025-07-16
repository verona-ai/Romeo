# Basic Slack Bot Example

This example demonstrates how to use the `@romeo/slack` package to create a feature-rich Slack bot with full TypeScript support, leveraging Slack's official SDK.

## Features

- ✅ **Full TypeScript Support** - Built on Slack's official TypeScript SDK
- ✅ **Block Kit Integration** - Rich interactive messages with buttons and components
- ✅ **Events API** - Handles all Slack events (messages, joins, leaves, etc.)
- ✅ **Interactive Components** - Buttons, select menus, modals, and more
- ✅ **Webhook Security** - Proper signature verification for all requests
- ✅ **Error Handling** - Comprehensive error handling and logging
- ✅ **Production Ready** - Rate limiting, retry logic, and graceful degradation

## Setup

### 1. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Choose your app name and workspace
4. Navigate through the setup sections below

### 2. Configure Bot Token Scopes

In your Slack app settings, go to **OAuth & Permissions** and add these Bot Token Scopes:

**Required Scopes:**
- `chat:write` - Send messages as the bot
- `users:read` - Read user profile information
- `channels:read` - Read public channel information
- `groups:read` - Read private channel information  
- `im:read` - Read direct message information
- `files:read` - Handle file uploads

**Optional Scopes (for advanced features):**
- `chat:write.public` - Send messages to channels without joining
- `reactions:read` - Read message reactions
- `reactions:write` - Add reactions to messages
- `channels:history` - Read message history
- `groups:history` - Read private channel history
- `im:history` - Read DM history

### 3. Install Dependencies and Configure

```bash
cd examples/basic-slack-bot
pnpm install
cp .env.example .env
# Edit .env with your Slack credentials
```

### 4. Configure Event Subscriptions

In your Slack app settings, go to **Event Subscriptions**:

1. Enable Events: `On`
2. Request URL: `https://your-domain.com/slack/events`
3. Subscribe to Bot Events:
   - `message.channels` - Messages in public channels
   - `message.groups` - Messages in private channels
   - `message.im` - Direct messages
   - `app_home_opened` - When users open your app's Home tab
   - `member_joined_channel` - When users join channels
   - `member_left_channel` - When users leave channels

### 5. Configure Interactive Components

In your Slack app settings, go to **Interactive Components**:

1. Enable Interactive Components: `On`
2. Request URL: `https://your-domain.com/slack/interactive`

### 6. Install App to Workspace

1. Go to **OAuth & Permissions**
2. Click "Install to Workspace"
3. Copy the "Bot User OAuth Token" (starts with `xoxb-`)
4. Copy the "Signing Secret" from **Basic Information**

### 7. Start the Bot

```bash
pnpm dev
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SLACK_BOT_TOKEN` | Bot User OAuth Token from OAuth & Permissions | `xoxb-1234...` |
| `SLACK_SIGNING_SECRET` | Signing Secret from Basic Information | `a1b2c3d4...` |
| `SLACK_APP_TOKEN` | App-Level Token (for Socket Mode, optional) | `xapp-1-A123...` |
| `PORT` | Server port | `3000` |

## Usage

The bot responds to various interactions:

### 💬 Text Messages
- **"hello" or "hi"** → Rich welcome message with interactive buttons
- **"help"** → Help documentation with formatting
- **Any other text** → Echo response with the original message

### 📎 File Uploads
- Responds to any file upload with acknowledgment
- Supports images, videos, audio, and documents

### 🎛️ Interactive Components
- **Get Help** button → Shows help documentation
- **Learn More** button → Rich Block Kit message with Romeo features
- **Contact Support** button → Support contact information

## Code Structure

```
src/
├── index.ts              # Main bot server and logic
```

### Key Components

- **SlackClient**: Official Slack Web API client with Romeo integration
- **SlackWebhookHandler**: Processes Events API and Interactive Components
- **Block Kit Builder**: Type-safe Slack UI components
- **Custom Handler**: Your bot's message processing logic

### Example: Rich Interactive Message

```typescript
const blocks = blockKit.builder()
  .header('👋 Welcome!')
  .section('Choose what you want to do:')
  .buttons([
    { text: 'Get Help', actionId: 'help', style: 'primary' },
    { text: 'Learn More', actionId: 'learn' }
  ])
  .build();

await slackClient.sendInteractiveMessage(channelId, {
  id: 'welcome_msg',
  platform: 'slack',
  conversationId: channelId,
  userId: 'bot',
  type: 'interactive',
  role: 'assistant',
  timestamp: new Date(),
  metadata: { blocks }
});
```

### Example: Button Click Handler

```typescript
class CustomSlackHandler extends SlackWebhookHandler {
  async handleInteractiveComponent(payload: any): Promise<void> {
    const action = payload.actions?.[0];
    
    if (action.action_id === 'help') {
      await slackClient.sendTextMessage(
        payload.channel.id,
        '🛟 Here\'s how to use this bot...'
      );
    }
  }
}
```

## Advanced Features

### Block Kit Components

Romeo's Slack integration provides full Block Kit support:

```typescript
import { blockKit } from '@romeo/slack';

// Rich layout components
const blocks = blockKit.builder()
  .header('Dashboard')
  .section('Current status: All systems operational')
  .divider()
  .fields([
    { title: 'Users', value: '1,234 active' },
    { title: 'Messages', value: '56,789 today' }
  ])
  .staticSelect('Choose option', 'select_action', [
    { text: 'View Details', value: 'details' },
    { text: 'Download Report', value: 'report' }
  ])
  .build();
```

### Modal Dialogs

```typescript
import { SlackModalBuilder } from '@romeo/slack';

const modal = new SlackModalBuilder()
  .title('Feedback Form')
  .submit('Submit')
  .close('Cancel')
  .blocks([
    blockKit.plainTextInput('Your feedback', 'feedback_input', 'feedback_block'),
    blockKit.staticSelect('Rating', 'rating_select', [
      { text: 'Excellent', value: '5' },
      { text: 'Good', value: '4' },
      { text: 'Average', value: '3' }
    ])
  ])
  .build();

await slackClient.openModal(triggerId, modal);
```

### App Home Tab

```typescript
import { SlackAppHomeBuilder } from '@romeo/slack';

const homeView = new SlackAppHomeBuilder()
  .blocks([
    blockKit.header('Welcome to Romeo Bot'),
    blockKit.section('Manage your bot settings and view analytics'),
    blockKit.buttons([
      { text: 'Settings', actionId: 'open_settings' },
      { text: 'Analytics', actionId: 'view_analytics' }
    ])
  ])
  .build();

await slackClient.updateAppHome(userId, homeView);
```

## Production Deployment

### Environment Setup

1. **Use HTTPS** - Slack requires HTTPS endpoints
2. **Environment Variables** - Store secrets securely
3. **Error Monitoring** - Implement proper logging and monitoring
4. **Rate Limiting** - Handle Slack's rate limits gracefully

### Deployment Options

**Vercel/Netlify Functions:**
```bash
# Deploy as serverless functions
vercel deploy
```

**Railway/Heroku:**
```bash
# Deploy as container app
railway deploy
```

**AWS/GCP/Azure:**
```bash
# Deploy to cloud platforms
docker build -t slack-bot .
```

### Security Best Practices

1. **Webhook Verification** - Always verify Slack signatures
2. **Token Security** - Store tokens as environment variables
3. **HTTPS Only** - Never use HTTP endpoints in production
4. **Input Validation** - Validate all incoming data
5. **Rate Limiting** - Respect Slack's API limits

## Troubleshooting

### Common Issues

**❌ Webhook verification fails**
- Check your signing secret matches exactly
- Ensure you're using the raw request body for verification
- Verify timestamp is within 5 minutes

**❌ Events not received**
- Check Event Subscriptions are properly configured
- Verify your webhook URL is accessible from internet
- Ensure bot is added to channels you want to monitor

**❌ Interactive components not working**
- Check Interactive Components URL is configured
- Verify the URL can handle POST requests
- Check payload parsing (URL-encoded form data)

**❌ Permission errors**
- Verify bot token scopes in OAuth & Permissions
- Ensure bot is invited to channels
- Check token format (should start with `xoxb-`)

### Debug Commands

```bash
# Test webhook endpoint
curl -X POST http://localhost:3000/slack/events \
  -H "Content-Type: application/json" \
  -d '{"type":"url_verification","challenge":"test"}'

# Check health endpoint
curl http://localhost:3000/health

# View bot info
curl -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  https://slack.com/api/auth.test
```

## Next Steps

1. **Add AI Integration** - Connect with OpenAI, Claude, or other LLMs
2. **Database Integration** - Store conversation history and user preferences  
3. **Multi-Workspace** - Support multiple Slack workspaces
4. **Advanced Workflows** - Implement complex business logic
5. **Analytics** - Track usage and performance metrics

## Resources

- **[Slack API Documentation](https://api.slack.com/)** - Official Slack API docs
- **[Block Kit Builder](https://app.slack.com/block-kit-builder)** - Visual Block Kit designer
- **[Romeo Documentation](https://docs.romeo.dev)** - Romeo integration guides
- **[TypeScript Slack SDK](https://slack.dev/node-slack-sdk/typescript)** - Official TS docs 