import { Logger } from '../logger';

const logger = new Logger({ module: 'feishu-monitor' });

export interface FeishuMessageEvent {
  eventId: string;
  eventType: string;
  chatId?: string;
  messageId?: string;
  content?: string;
  timestamp: number;
}

/**
 * Monitors incoming Feishu message events
 */
export class FeishuMonitor {
  private eventHandlers: Map<string, (event: FeishuMessageEvent) => Promise<void>> = new Map();

  /**
   * Register an event handler
   */
  onEvent(eventType: string, handler: (event: FeishuMessageEvent) => Promise<void>): void {
    this.eventHandlers.set(eventType, handler);
  }

  /**
   * Process an incoming Feishu message event
   */
  async processEvent(event: FeishuMessageEvent): Promise<void> {
    logger.info('Received Feishu message event', { 
      eventId: event.eventId,
      eventType: event.eventType 
    });

    const handler = this.eventHandlers.get(event.eventType);
    if (handler) {
      try {
        await handler(event);
      } catch (error) {
        logger.error(`Error processing event: ${(error as Error).message}`, {
          eventId: event.eventId,
          eventType: event.eventType
        });
      }
    } else {
      logger.warn('No handler registered for event type', { 
        eventType: event.eventType 
      });
    }
  }

  /**
   * Simulate receiving a message event
   */
  simulateEvent(eventType: string = 'message.received'): FeishuMessageEvent {
    const event: FeishuMessageEvent = {
      eventId: `event_${Date.now()}`,
      eventType,
      chatId: 'chat_123',
      messageId: 'msg_456',
      content: 'Hello, bot!',
      timestamp: Date.now()
    };

    return event;
  }
}
