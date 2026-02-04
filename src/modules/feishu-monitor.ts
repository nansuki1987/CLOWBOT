import { createLogger } from '../utils/logger';
import { messageHandler } from './feishu-message';

const logger = createLogger('feishu-monitor');

/**
 * Feishu message event structure
 */
export interface FeishuMessageEvent {
  eventId: string;
  sessionId: string;
  content: string;
  timestamp: number;
}

/**
 * Monitors and handles incoming Feishu message events
 */
export class FeishuMonitor {
  /**
   * Processes incoming Feishu message event
   */
  async handleMessageEvent(event: FeishuMessageEvent): Promise<void> {
    logger.info('Received Feishu message event');
    
    try {
      const result = await messageHandler.sendMessage({
        sessionId: event.sessionId,
        content: event.content,
        preferStreaming: true
      });
      
      if (result.success) {
        logger.info(`Message delivered successfully via ${result.mode} mode`);
      } else {
        logger.error(`Failed to deliver message: ${result.error}`);
      }
    } catch (error) {
      logger.error(`Error handling message event: ${error}`);
    }
  }
}

// Singleton instance
export const feishuMonitor = new FeishuMonitor();
