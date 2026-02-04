import { createLogger } from '../utils/logger';
import { isPermissionError, parsePermissionError } from '../types/feishu';

const logger = createLogger('feishu-streaming');

/**
 * Configuration options for FeishuStreamingManager
 */
export interface StreamingManagerConfig {
  cooldownMs?: number;
}

/**
 * Manages streaming session state and permission checking
 */
export class FeishuStreamingManager {
  private hasCardWritePermission: boolean | null = null;
  private permissionCheckFailed = false;
  private lastPermissionCheckTime: number = 0;
  private readonly permissionCheckCooldown: number;

  constructor(config: StreamingManagerConfig = {}) {
    // Default to 60 seconds, can be overridden via config or environment variable
    this.permissionCheckCooldown = config.cooldownMs 
      ?? parseInt(process.env.FEISHU_PERMISSION_CHECK_COOLDOWN_MS || '60000', 10);
  }

  /**
   * Attempts to start a streaming session
   * @param sessionId - The session identifier
   * @returns Promise resolving to streaming session info or null if unavailable
   */
  async startStreamingSession(sessionId: string): Promise<any | null> {
    // Check if we've recently determined permissions are missing
    if (this.hasCardWritePermission === false) {
      const timeSinceLastCheck = Date.now() - this.lastPermissionCheckTime;
      
      if (timeSinceLastCheck < this.permissionCheckCooldown) {
        logger.debug(`Skipping streaming card creation - missing required permission (cardkit:card:write). Cooldown active for ${Math.ceil((this.permissionCheckCooldown - timeSinceLastCheck) / 1000)}s`);
        return null;
      }
    }

    try {
      // Simulate creating a streaming card (actual implementation would call Feishu API)
      const streamingCard = await this.createStreamingCard(sessionId);
      
      // If successful, mark permission as available
      this.hasCardWritePermission = true;
      this.permissionCheckFailed = false;
      logger.info(`Streaming session started successfully for session: ${sessionId}`);
      
      return streamingCard;
    } catch (error) {
      return this.handleStreamingError(error as Error, sessionId);
    }
  }

  /**
   * Creates a streaming card via Feishu API
   * @param sessionId - The session identifier
   */
  private async createStreamingCard(sessionId: string): Promise<any> {
    // This is where the actual Feishu API call would happen
    // For now, we simulate the API call
    throw new Error('Failed to create streaming card: Access denied. One of the following scopes is required: [cardkit:card:write].应用尚未开通所需的应用身份权限：[cardkit:card:write]，点击链接申请并开通任一权限即可：https://open.feishu.cn/app/cli_a9f590bd7a78dcc9/auth?q=cardkit:card:write&op_from=openapi&token_type=tenant');
  }

  /**
   * Handles errors during streaming card creation
   */
  private handleStreamingError(error: Error, sessionId: string): null {
    if (isPermissionError(error)) {
      const permissionDetails = parsePermissionError(error.message);
      
      // Only log the permission error once, then cache the result
      if (!this.permissionCheckFailed) {
        logger.error(`Failed to start streaming session: ${error.message}`);
        
        if (permissionDetails?.authUrl) {
          logger.warn(`Missing required permission: ${permissionDetails.scope}. To enable streaming cards, please grant the permission at: ${permissionDetails.authUrl}`);
        }
        
        this.permissionCheckFailed = true;
      }
      
      // Mark permission as unavailable and record check time
      this.hasCardWritePermission = false;
      this.lastPermissionCheckTime = Date.now();
      
      logger.debug(`Streaming unavailable for session ${sessionId} - falling back to standard message mode`);
      return null;
    }
    
    // For non-permission errors, log and return null
    logger.error(`Failed to start streaming session: ${error.message}`);
    return null;
  }

  /**
   * Resets permission state (useful for testing or manual retry)
   */
  resetPermissionState(): void {
    this.hasCardWritePermission = null;
    this.permissionCheckFailed = false;
    this.lastPermissionCheckTime = 0;
    logger.info('Permission state reset');
  }

  /**
   * Gets current permission status
   */
  getPermissionStatus(): { hasPermission: boolean | null; lastCheckTime: number } {
    return {
      hasPermission: this.hasCardWritePermission,
      lastCheckTime: this.lastPermissionCheckTime
    };
  }
}

// Singleton instance
export const streamingManager = new FeishuStreamingManager();
