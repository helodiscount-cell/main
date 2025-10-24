// Simple backend logger - just API routes and DB changes

class SimpleLogger {
  private log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : "";
    console.log(`[${timestamp}] ${message}${dataStr}`);
  }

  // API route logger
  apiRoute(method: string, route: string, body?: any) {
    this.log(`API ${method} ${route}`, body);
  }

  // Database change logger
  dbChange(operation: string, table: string, changes: any) {
    this.log(`DB ${operation} ${table}`, changes);
  }
}

export const logger = new SimpleLogger();
