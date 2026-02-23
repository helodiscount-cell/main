export class ApiRouteError extends Error {
  public statusCode: number;
  public code?: string;

  constructor(message: string, code?: string, statusCode?: number) {
    super(message);
    this.name = "ApiRouteError";
    this.statusCode = statusCode || 500;
    this.code = code;
    this.message = message;
  }
}
