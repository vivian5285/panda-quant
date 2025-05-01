const isDevelopment = process.env['NODE_ENV'] === 'development';

class Logger {
  private prefix: string;

  constructor(prefix = '') {
    this.prefix = prefix ? `[${prefix}] ` : '';
  }

  info(message: string, ...args: unknown[]) {
    if (isDevelopment) {
      console.log(`${this.prefix}${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]) {
    console.warn(`${this.prefix}${message}`, ...args);
  }

  error(message: string, ...args: unknown[]) {
    console.error(`${this.prefix}${message}`, ...args);
  }

  debug(message: string, ...args: unknown[]) {
    if (isDevelopment) {
      console.debug(`${this.prefix}${message}`, ...args);
    }
  }
}

// 创建默认logger实例
export const logger = new Logger();

// 创建带有特定前缀的logger实例
export const createLogger = (prefix: string) => new Logger(prefix);

// 创建特定用途的logger实例
export const requestLogger = createLogger('request');
export const errorLogger = createLogger('error'); 