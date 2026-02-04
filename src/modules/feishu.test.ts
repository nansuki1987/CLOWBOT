import { FeishuStreamingManager } from '../modules/feishu-streaming';
import { FeishuMessageHandler } from '../modules/feishu-message';
import { isPermissionError, parsePermissionError } from '../types/feishu';

describe('Feishu Streaming Fix', () => {
  describe('Permission Error Detection', () => {
    it('should detect permission errors correctly', () => {
      const error = new Error('Access denied. One of the following scopes is required: [cardkit:card:write]');
      expect(isPermissionError(error)).toBe(true);
    });

    it('should not detect non-permission errors', () => {
      const error = new Error('Network timeout');
      expect(isPermissionError(error)).toBe(false);
    });

    it('should parse permission error details', () => {
      const errorMessage = 'Access denied. One of the following scopes is required: [cardkit:card:write].应用尚未开通所需的应用身份权限：[cardkit:card:write]，点击链接申请并开通任一权限即可：https://open.feishu.cn/app/cli_a9f590bd7a78dcc9/auth?q=cardkit:card:write';
      const result = parsePermissionError(errorMessage);
      
      expect(result).not.toBeNull();
      expect(result?.scope).toBe('cardkit:card:write');
      expect(result?.authUrl).toContain('https://open.feishu.cn');
    });
  });

  describe('FeishuStreamingManager', () => {
    let manager: FeishuStreamingManager;

    beforeEach(() => {
      manager = new FeishuStreamingManager();
    });

    it('should handle permission errors gracefully', async () => {
      const result = await manager.startStreamingSession('test-session');
      expect(result).toBeNull();
      
      const status = manager.getPermissionStatus();
      expect(status.hasPermission).toBe(false);
    });

    it('should not retry immediately after permission failure', async () => {
      // First attempt
      await manager.startStreamingSession('test-session-1');
      
      // Second attempt should be skipped due to cooldown
      const result = await manager.startStreamingSession('test-session-2');
      expect(result).toBeNull();
    });

    it('should allow permission state reset', () => {
      manager.resetPermissionState();
      const status = manager.getPermissionStatus();
      expect(status.hasPermission).toBeNull();
      expect(status.lastCheckTime).toBe(0);
    });
  });

  describe('FeishuMessageHandler', () => {
    let handler: FeishuMessageHandler;

    beforeEach(() => {
      handler = new FeishuMessageHandler();
    });

    it('should fall back to standard message when streaming fails', async () => {
      const result = await handler.sendMessage({
        sessionId: 'test-session',
        content: 'Test message',
        preferStreaming: true
      });
      
      expect(result.success).toBe(true);
      expect(result.mode).toBe('standard');
    });

    it('should use standard mode when streaming is not preferred', async () => {
      const result = await handler.sendMessage({
        sessionId: 'test-session',
        content: 'Test message',
        preferStreaming: false
      });
      
      expect(result.success).toBe(true);
      expect(result.mode).toBe('standard');
    });
  });
});
