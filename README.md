# CLOWBOT

A Feishu/Lark bot with intelligent streaming card support and graceful error handling.

## Features

- **Streaming Card Support**: Uses Feishu streaming cards when available
- **Graceful Fallback**: Automatically falls back to regular messages when streaming is unavailable
- **Smart Error Handling**: Reduces error spam with intelligent error suppression
- **Auto-disable on Permission Errors**: Automatically disables streaming after repeated permission failures
- **Configurable**: Easy to configure behavior through configuration options

## Problem Solved

This bot addresses the common issue where Feishu applications lack the `cardkit:card:write` permission, causing repeated streaming card creation failures. Instead of spamming error logs, the bot:

1. Logs the first permission error prominently with full details
2. Reduces subsequent error log noise by using debug level
3. Automatically disables streaming after a threshold (default: 3 errors)
4. Falls back to regular message sending
5. Includes helpful links to grant the required permissions

## Installation

```bash
npm install
```

## Configuration

The bot can be configured with the following options:

```typescript
{
  enableStreamingCard: true,      // Enable/disable streaming card feature
  maxStreamingRetries: 3,         // Number of retries before disabling
  baseRetryDelay: 1000,          // Base delay for exponential backoff (ms)
  silentFallback: false          // Whether to suppress fallback logs
}
```

## Usage

```typescript
import { ClowBot } from './src';

// Create bot with optional configuration
const bot = new ClowBot({
  enableStreamingCard: true,
  maxStreamingRetries: 3
});

// Start the bot
await bot.start();

// Get monitor to process events
const monitor = bot.getMonitor();

// Process incoming Feishu message events
await monitor.processEvent({
  eventId: 'event_123',
  eventType: 'message.received',
  chatId: 'chat_456',
  messageId: 'msg_789',
  content: 'Hello bot!',
  timestamp: Date.now()
});

// Check bot status
const status = bot.getStatus();
console.log(status);
```

## Running the Example

To see the error handling in action:

```bash
npm run build
node dist/example.js
```

This will simulate the streaming card permission error scenario and demonstrate the graceful fallback behavior.

## Development

```bash
# Build the project
npm run build

# Run linter
npm run lint

# Run the example
npm start
```

## Required Permissions

If you want to use streaming cards, you need to grant the following Feishu permission:

- `cardkit:card:write` - Required to create and update streaming cards

If this permission is not available, the bot will automatically fall back to regular message sending.

## Architecture

### Modules

- **feishu-streaming**: Manages streaming card sessions with error handling
- **feishu-message**: Handles message sending with optional streaming support
- **feishu-monitor**: Monitors and processes incoming Feishu events
- **config**: Configuration management
- **logger**: Structured logging with different log levels

### Error Handling Flow

1. Attempt to create streaming card
2. On permission error:
   - First error: Log at ERROR level with full details
   - Subsequent errors: Log at DEBUG level to reduce noise
   - After threshold: Disable streaming and log warning
3. Fall back to regular message sending
4. Continue operating normally without streaming

## License

MIT