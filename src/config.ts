/**
 * Configuration for the Feishu bot
 */
export interface FeishuConfig {
  // Whether to enable streaming card feature
  enableStreamingCard: boolean;
  
  // Maximum number of retries for streaming card creation
  maxStreamingRetries: number;
  
  // Base delay for exponential backoff (in milliseconds)
  baseRetryDelay: number;
  
  // Whether to fail silently when streaming is not available
  silentFallback: boolean;
}

export const defaultConfig: FeishuConfig = {
  enableStreamingCard: true,
  maxStreamingRetries: 3,
  baseRetryDelay: 1000,
  silentFallback: false
};

export class ConfigManager {
  private config: FeishuConfig;

  constructor(config?: Partial<FeishuConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  getConfig(): FeishuConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<FeishuConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  isStreamingEnabled(): boolean {
    return this.config.enableStreamingCard;
  }

  disableStreaming(): void {
    this.config.enableStreamingCard = false;
  }
}
