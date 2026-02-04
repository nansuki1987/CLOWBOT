import { feishuMonitor } from './modules/feishu-monitor';
import { streamingManager } from './modules/feishu-streaming';

/**
 * Main entry point for CLOWBOT
 */
async function main() {
  console.log('CLOWBOT starting...');
  
  // Simulate handling a message event
  await feishuMonitor.handleMessageEvent({
    eventId: 'test-event-1',
    sessionId: 'test-session-1',
    content: 'Test message',
    timestamp: Date.now()
  });
  
  console.log('\nPermission Status:', streamingManager.getPermissionStatus());
  console.log('\nCLOWBOT ready. The streaming permission error has been handled gracefully.');
}

// Run if this is the main module
if (require.main === module) {
  main().catch(console.error);
}

export { feishuMonitor, streamingManager };
