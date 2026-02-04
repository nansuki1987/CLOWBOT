# Feishu Streaming Permission Error Fix - Example

This example demonstrates how the fix handles the missing `cardkit:card:write` permission gracefully.

## Before the Fix

When the permission was missing, the application would:
1. **Repeatedly attempt** to create streaming cards
2. **Log error messages repeatedly** for every attempt
3. **Clutter the console** with the same error over and over

Example log output (problematic):
```
14:03:00 error feishu-streaming Failed to start streaming session: Error: Access denied...
14:03:00 warn feishu-message Failed to start streaming card: Error: Access denied...
14:03:06 error feishu-streaming Failed to start streaming session: Error: Access denied...
14:03:06 warn feishu-message Failed to start streaming card: Error: Access denied...
14:03:12 error feishu-streaming Failed to start streaming session: Error: Access denied...
14:03:12 warn feishu-message Failed to start streaming card: Error: Access denied...
```

## After the Fix

With the fix, the application now:
1. **Detects the permission error** on first attempt
2. **Logs the error once** with clear guidance on how to fix it
3. **Caches the permission state** for 60 seconds (configurable)
4. **Automatically falls back** to standard message delivery
5. **Uses debug-level logs** for subsequent attempts during cooldown

Example log output (improved):
```
2026-02-04 14:12:06 info feishu-monitor Received Feishu message event
2026-02-04 14:12:06 error feishu-streaming Failed to start streaming session: Error: Access denied...
2026-02-04 14:12:06 warn feishu-streaming Missing required permission: cardkit:card:write. To enable streaming cards, please grant the permission at: https://open.feishu.cn/app/...
2026-02-04 14:12:06 info feishu-message Message sent via standard delivery for session: test-session-1
2026-02-04 14:12:06 info feishu-monitor Message delivered successfully via standard mode
```

## Key Benefits

1. **Clean Logs**: Error is logged once, not repeatedly
2. **Clear Guidance**: Provides the exact URL to grant permission
3. **No Interruption**: Messages are still delivered successfully
4. **Smart Retry**: After cooldown, it will check again in case permissions are granted
5. **Configurable**: Cooldown period can be adjusted via config or environment variable

## Configuration

Set the cooldown period via environment variable:
```bash
export FEISHU_PERMISSION_CHECK_COOLDOWN_MS=120000  # 2 minutes
npm start
```

Or programmatically:
```typescript
import { FeishuStreamingManager } from './modules/feishu-streaming';

const manager = new FeishuStreamingManager({ cooldownMs: 120000 });
```

## Testing

Run the test suite to verify all scenarios:
```bash
npm test
```

All tests pass, including:
- Permission error detection
- Cooldown mechanism
- Fallback to standard messages
- Permission state management
