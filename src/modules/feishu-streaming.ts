import { Logger } from '../logger';
import { ConfigManager } from '../config';

const logger = new Logger({ module: 'feishu-streaming' });

export interface StreamingSession {
  id: string;
  cardId?: string;
  started: boolean;
  error?: Error;
}

export interface StreamingCardOptions {
  title?: string;
  content?: string;
  chatId?: string;
  messageId?: string;
}

/**
 * Error thrown when streaming card permission is not available
 */
export class StreamingPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StreamingPermissionError';
  }
}

/**
 * Manages Feishu streaming card sessions with proper error handling
 */
export class FeishuStreamingManager {
  private sessions: Map<string, StreamingSession> = new Map();
  private permissionErrorCount: number = 0;
  private lastPermissionError: number = 0;
  private permissionErrorThreshold: number = 3;
  private errorSuppressWindow: number = 60000; // 60 seconds

  constructor(private configManager: ConfigManager) {}

  /**
   * Check if we should attempt to create a streaming card
   */
  private shouldAttemptStreaming(): boolean {
    if (!this.configManager.isStreamingEnabled()) {
      return false;
    }

    // If we've had too many permission errors recently, don't try
    const now = Date.now();
    if (this.permissionErrorCount >= this.permissionErrorThreshold) {
      if (now - this.lastPermissionError < this.errorSuppressWindow) {
        logger.debug('Streaming disabled due to recent permission errors');
        return false;
      } else {
        // Reset counter after the suppress window
        this.permissionErrorCount = 0;
      }
    }

    return true;
  }

  /**
   * Handle permission error and decide whether to disable streaming
   */
  private handlePermissionError(error: Error): void {
    this.permissionErrorCount++;
    this.lastPermissionError = Date.now();

    const isPermissionError = error.message.includes('cardkit:card:write') ||
                               error.message.includes('Access denied');

    if (isPermissionError) {
      if (this.permissionErrorCount === 1) {
        // First time seeing this error, log it prominently
        logger.error(
          `Failed to start streaming session: ${error.message}`,
          { permissionErrorCount: this.permissionErrorCount }
        );
      } else if (this.permissionErrorCount >= this.permissionErrorThreshold) {
        // After threshold, disable streaming and log once
        logger.warn(
          'Streaming card feature disabled due to missing permissions. ' +
          'To re-enable, grant cardkit:card:write permission and restart.',
          { permissionErrorCount: this.permissionErrorCount }
        );
        this.configManager.disableStreaming();
      } else {
        // Intermediate errors - log at debug level to reduce noise
        logger.debug(
          `Streaming card creation failed: ${error.message}`,
          { permissionErrorCount: this.permissionErrorCount }
        );
      }
    } else {
      // Non-permission error, log normally
      logger.error(`Failed to start streaming session: ${error.message}`);
    }
  }

  /**
   * Start a streaming session
   */
  async startSession(options: StreamingCardOptions): Promise<StreamingSession> {
    const sessionId = this.generateSessionId();
    
    if (!this.shouldAttemptStreaming()) {
      logger.debug('Streaming not available, using fallback', { sessionId });
      return this.createFallbackSession(sessionId);
    }

    try {
      // Simulate streaming card creation
      // In real implementation, this would call Feishu API
      const cardId = await this.createStreamingCard(options);
      
      const session: StreamingSession = {
        id: sessionId,
        cardId,
        started: true
      };
      
      this.sessions.set(sessionId, session);
      logger.info('Streaming session started successfully', { sessionId, cardId });
      
      // Reset error count on success
      this.permissionErrorCount = 0;
      
      return session;
    } catch (error) {
      this.handlePermissionError(error as Error);
      return this.createFallbackSession(sessionId, error as Error);
    }
  }

  /**
   * Create a fallback session when streaming is not available
   */
  private createFallbackSession(sessionId: string, error?: Error): StreamingSession {
    const session: StreamingSession = {
      id: sessionId,
      started: false,
      error
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Simulate streaming card creation (placeholder for actual API call)
   */
  private async createStreamingCard(_options: StreamingCardOptions): Promise<string> {
    // This is a placeholder - in real implementation, this would call Feishu API
    // For now, simulate a permission error to demonstrate error handling
    throw new StreamingPermissionError(
      'Failed to create streaming card: Access denied. One of the following scopes is required: ' +
      '[cardkit:card:write].应用尚未开通所需的应用身份权限：[cardkit:card:write]，点击链接申请并开通任一权限即可：' +
      'https://open.feishu.cn/app/cli_a9f590bd7a78dcc9/auth?q=cardkit:card:write&op_from=openapi&token_type=tenant'
    );
  }

  /**
   * Update a streaming session
   */
  async updateSession(sessionId: string, _content: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    if (!session.started || !session.cardId) {
      logger.debug('Session not using streaming, skipping update', { sessionId });
      return;
    }

    // In real implementation, this would update the streaming card
    logger.debug('Streaming card updated', { sessionId, cardId: session.cardId });
  }

  /**
   * End a streaming session
   */
  async endSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    if (session.started && session.cardId) {
      // In real implementation, this would close the streaming card
      logger.debug('Streaming session ended', { sessionId, cardId: session.cardId });
    }

    this.sessions.delete(sessionId);
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current streaming status
   */
  getStatus(): {
    enabled: boolean;
    permissionErrorCount: number;
    activeSessions: number;
  } {
    return {
      enabled: this.configManager.isStreamingEnabled() && this.shouldAttemptStreaming(),
      permissionErrorCount: this.permissionErrorCount,
      activeSessions: this.sessions.size
    };
  }
}
