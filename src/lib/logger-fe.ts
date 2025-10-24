type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatMessage(entry: LogEntry): string {
    const { timestamp, level, message, data, requestId } = entry;
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const requestPrefix = requestId ? `[${requestId}]` : "";
    const dataStr = data ? ` | Data: ${JSON.stringify(data, null, 2)}` : "";

    return `${prefix} ${requestPrefix} ${message}${dataStr}`;
  }

  private log(
    level: LogLevel,
    message: string,
    data?: any,
    requestId?: string
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      requestId,
    };

    const formattedMessage = this.formatMessage(entry);

    if (this.isDevelopment) {
      switch (level) {
        case "error":
          console.error(formattedMessage);
          break;
        case "warn":
          console.warn(formattedMessage);
          break;
        case "debug":
          console.debug(formattedMessage);
          break;
        default:
          console.log(formattedMessage);
      }
    } else {
      // In production, you might want to send logs to a service
      console.log(formattedMessage);
    }
  }

  info(message: string, data?: any, requestId?: string) {
    this.log("info", message, data, requestId);
  }

  warn(message: string, data?: any, requestId?: string) {
    this.log("warn", message, data, requestId);
  }

  error(message: string, data?: any, requestId?: string) {
    this.log("error", message, data, requestId);
  }

  debug(message: string, data?: any, requestId?: string) {
    this.log("debug", message, data, requestId);
  }
}

export const logger = new Logger();
