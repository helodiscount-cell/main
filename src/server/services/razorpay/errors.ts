export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = this.constructor.name;
    // Maintain proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class RazorpayError extends AppError {
  constructor(message: string, statusCode = 502) {
    super(message, "RAZORPAY_ERROR", statusCode);
  }
}

export class SignatureVerificationError extends AppError {
  constructor() {
    super("Webhook signature verification failed", "INVALID_SIGNATURE", 400);
  }
}

export class OrderCreationError extends AppError {
  constructor(public readonly cause: unknown) {
    super("Failed to create order", "ORDER_CREATION_FAILED", 502);
  }
}

export class PaymentVerificationError extends AppError {
  constructor(public readonly cause?: unknown) {
    super("Payment signature is invalid", "PAYMENT_VERIFICATION_FAILED", 400);
  }
}
