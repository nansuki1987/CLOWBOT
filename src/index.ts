import { ConfigManager } from './config';
import { FeishuStreamingManager } from './modules/feishu-streaming';
import { FeishuMessageManager } from './modules/feishu-message';
import { FeishuMonitor, FeishuMessageEvent } from './modules/feishu-monitor';
import { Logger } from './logger';

const logger = new Logger({ module: 'main' });

/**
 * Main application class
 */
export class ClowBot {
  private configManager: ConfigManager;
  private streamingManager: FeishuStreamingManager;
  private messageManager: FeishuMessageManager;
  private monitor: FeishuMonitor;

  constructor(config?: any) {
    this.configManager = new ConfigManager(config);
    this.streamingManager = new FeishuStreamingManager(this.configManager);
    this.messageManager = new FeishuMessageManager(this.streamingManager);
    this.monitor = new FeishuMonitor();

    this.setupEventHandlers();
  }

  /**
   * Setup event handlers for incoming messages
   */
  private setupEventHandlers(): void {
    this.monitor.onEvent('message.received', async (event: FeishuMessageEvent) => {
      await this.handleMessageEvent(event);
    });
  }

  /**
   * Handle incoming message events
   */
  private async handleMessageEvent(event: FeishuMessageEvent): Promise<void> {
    logger.info('Processing message event', { eventId: event.eventId });

    // Send a response with streaming if available
    await this.messageManager.sendMessage({
      chatId: event.chatId,
      messageId: event.messageId,
      content: `Echo: ${event.content}`,
      useStreaming: true
    });
  }

  /**
   * Start the bot
   */
  async start(): Promise<void> {
    logger.info('ClowBot starting...', {
      streamingEnabled: this.configManager.isStreamingEnabled()
    });

    // Bot is now ready to receive events
    logger.info('ClowBot started successfully');
  }

  /**
   * Stop the bot
   */
  async stop(): Promise<void> {
    logger.info('ClowBot stopping...');
    // Cleanup resources
    logger.info('ClowBot stopped');
  }

  /**
   * Get the monitor for external event processing
   */
  getMonitor(): FeishuMonitor {
    return this.monitor;
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      streaming: this.messageManager.getStreamingStatus(),
      config: this.configManager.getConfig()
    };
  }
}

// Export all modules
export { ConfigManager, FeishuConfig } from './config';
export { FeishuStreamingManager, StreamingPermissionError } from './modules/feishu-streaming';
export { FeishuMessageManager } from './modules/feishu-message';
export { FeishuMonitor, FeishuMessageEvent } from './modules/feishu-monitor';
export { Logger, LogLevel } from './logger';
