# CLOWBOT

A bot with Feishu integration that gracefully handles streaming card permissions.

## Features

- **Graceful Permission Handling**: Automatically detects missing `cardkit:card:write` permission
- **Smart Fallback**: Falls back to standard message delivery when streaming is unavailable
- **Cooldown Mechanism**: Prevents repeated failed attempts to create streaming cards
- **Error Logging**: Clear, informative logging for debugging and monitoring

## Problem Solved

This implementation fixes the issue where the application would repeatedly attempt to create Feishu streaming cards without the required `cardkit:card:write` permission, resulting in repeated error logs:

```
error feishu-streaming {"module":"feishu-streaming"} Failed to start streaming session: Error: Failed to create streaming card: Access denied...
```

### Solution Highlights

1. **Permission Detection**: Detects permission errors and caches the result
2. **Cooldown Period**: Implements a 60-second cooldown after permission failure
3. **Automatic Fallback**: Seamlessly switches to standard message delivery
4. **Single Error Log**: Logs the permission error once, then uses debug-level messages

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Run

```bash
npm start
```

## Test

```bash
npm test
```

## Architecture

- **feishu-streaming.ts**: Manages streaming sessions with permission checking
- **feishu-message.ts**: Handles message delivery with automatic fallback
- **feishu-monitor.ts**: Monitors and processes incoming message events
- **types/feishu.ts**: Type definitions and utility functions

## Configuration

If you need to enable streaming cards, grant the `cardkit:card:write` permission in your Feishu app settings.