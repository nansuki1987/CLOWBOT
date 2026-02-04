/**
 * Logger utility with different log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogContext {
  module?: string;
  subsystem?: string;
  [key: string]: any;
}

export class Logger {
  constructor(private defaultContext: LogContext = {}) {}

  private formatTimestamp(): string {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = this.formatTimestamp();
    const mergedContext = { ...this.defaultContext, ...context };
    const contextStr = Object.keys(mergedContext).length > 0 
      ? JSON.stringify(mergedContext) 
      : '';
    
    console.log(`${timestamp} ${level} ${contextStr} ${message}`);
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context);
  }
}
