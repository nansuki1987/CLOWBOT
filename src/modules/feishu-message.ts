import { createLogger } from '../utils/logger';
import { streamingManager } from './feishu-streaming';

const logger = createLogger('feishu-message');

/**
 * Message delivery options
 */
export interface MessageOptions {
  sessionId: string;
  content: string;
  preferStreaming?: boolean;
}

/**
 * Message delivery result
 */
export interface MessageResult {
  success: boolean;
  mode: 'streaming' | 'standard';
  error?: string;
}

/**
 * Handles Feishu message delivery with automatic fallback
 */
export class FeishuMessageHandler {
  /**
   * Sends a message via Feishu, attempting streaming first if enabled
   */
  async sendMessage(options: MessageOptions): Promise<MessageResult> {
    const { sessionId, content, preferStreaming = true } = options;
    
    // Attempt streaming if preferred
    if (preferStreaming) {
      const streamingResult = await this.attemptStreamingMessage(sessionId, content);
      if (streamingResult.success) {
        return streamingResult;
      }
      
      // If streaming failed due to permissions, fall back to standard message
      logger.debug('Falling back to standard message delivery');
    }
    
    // Send standard message
    return this.sendStandardMessage(sessionId, content);
  }

  /**
   * Attempts to send a message via streaming card
   */
  private async attemptStreamingMessage(sessionId: string, content: string): Promise<MessageResult> {
    try {
      const streamingSession = await streamingManager.startStreamingSession(sessionId);
      
      if (!streamingSession) {
        // Permission denied or other issue - fallback needed
        return {
          success: false,
          mode: 'streaming',
          error: 'Streaming unavailable'
        };
      }
      
      // Simulate sending streaming message
      logger.info(`Message sent via streaming card for session: ${sessionId}`);
      return {
        success: true,
        mode: 'streaming'
      };
    } catch (error) {
      logger.warn(`Failed to start streaming card: ${error}`);
      return {
        success: false,
        mode: 'streaming',
        error: (error as Error).message
      };
    }
  }

  /**
   * Sends a standard (non-streaming) message
   */
  private async sendStandardMessage(sessionId: string, content: string): Promise<MessageResult> {
    try {
      // Simulate sending standard message (actual implementation would call Feishu API)
      logger.info(`Message sent via standard delivery for session: ${sessionId}`);
      return {
        success: true,
        mode: 'standard'
      };
    } catch (error) {
      logger.error(`Failed to send standard message: ${error}`);
      return {
        success: false,
        mode: 'standard',
        error: (error as Error).message
      };
    }
  }
}

// Singleton instance
export const messageHandler = new FeishuMessageHandler();
