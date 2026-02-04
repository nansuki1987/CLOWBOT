import { Logger } from '../logger';
import { FeishuStreamingManager, StreamingCardOptions } from './feishu-streaming';

const logger = new Logger({ module: 'feishu-message' });

export interface MessageOptions {
  chatId?: string;
  messageId?: string;
  content: string;
  useStreaming?: boolean;
}

/**
 * Manages Feishu message sending with optional streaming support
 */
export class FeishuMessageManager {
  constructor(private streamingManager: FeishuStreamingManager) {}

  /**
   * Send a message with optional streaming card
   */
  async sendMessage(options: MessageOptions): Promise<void> {
    const { chatId, messageId, content, useStreaming = true } = options;

    if (useStreaming) {
      try {
        const streamingOptions: StreamingCardOptions = {
          chatId,
          messageId,
          content,
          title: 'Response'
        };

        const session = await this.streamingManager.startSession(streamingOptions);
        
        if (session.started) {
          logger.info('Message sent with streaming card', { 
            sessionId: session.id,
            chatId,
            messageId 
          });
        } else {
          // Streaming not available, send regular message
          logger.info('Message sent without streaming (fallback)', { 
            chatId,
            messageId 
          });
          await this.sendRegularMessage(options);
        }
      } catch (error) {
        logger.warn(
          `Failed to start streaming card: ${(error as Error).message}`
        );
        // Fallback to regular message
        await this.sendRegularMessage(options);
      }
    } else {
      await this.sendRegularMessage(options);
    }
  }

  /**
   * Send a regular message without streaming
   */
  private async sendRegularMessage(options: MessageOptions): Promise<void> {
    const { chatId, messageId, content } = options;
    
    // In real implementation, this would call Feishu API to send a regular message
    logger.debug('Sending regular message', { chatId, messageId, contentLength: content.length });
  }

  /**
   * Update a streaming message
   */
  async updateMessage(sessionId: string, content: string): Promise<void> {
    try {
      await this.streamingManager.updateSession(sessionId, content);
      logger.debug('Message updated', { sessionId });
    } catch (error) {
      logger.warn(`Failed to update message: ${(error as Error).message}`, { sessionId });
    }
  }

  /**
   * Get streaming status
   */
  getStreamingStatus() {
    return this.streamingManager.getStatus();
  }
}
