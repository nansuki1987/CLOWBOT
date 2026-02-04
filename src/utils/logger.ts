import winston from 'winston';

/**
 * Logger utility for the application
 */
export const createLogger = (module: string) => {
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
        return `${timestamp} ${level} ${module} ${metaStr ? metaStr + ' ' : ''}${message}`;
      })
    ),
    transports: [
      new winston.transports.Console()
    ]
  });
};
