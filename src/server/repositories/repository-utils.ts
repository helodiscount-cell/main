/**
 * Repository Utilities
 * Shared error handling and retry logic for database operations
 */

import { logger } from "@/lib/utils/logger";
import { Prisma } from "@prisma/client";

/**
 * Database error types
 */
export enum DatabaseErrorType {
  CONNECTION = "CONNECTION",
  VALIDATION = "VALIDATION",
  NOT_FOUND = "NOT_FOUND",
  UNIQUE_CONSTRAINT = "UNIQUE_CONSTRAINT",
  FOREIGN_KEY = "FOREIGN_KEY",
  UNKNOWN = "UNKNOWN",
}

/**
 * Classifies Prisma errors
 */
export function classifyPrismaError(error: unknown): DatabaseErrorType {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 = Unique constraint violation
    if (error.code === "P2002") {
      return DatabaseErrorType.UNIQUE_CONSTRAINT;
    }
    // P2003 = Foreign key constraint violation
    if (error.code === "P2003") {
      return DatabaseErrorType.FOREIGN_KEY;
    }
    // P2025 = Record not found
    if (error.code === "P2025") {
      return DatabaseErrorType.NOT_FOUND;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return DatabaseErrorType.VALIDATION;
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return DatabaseErrorType.CONNECTION;
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return DatabaseErrorType.CONNECTION;
  }

  return DatabaseErrorType.UNKNOWN;
}

/**
 * Checks if an error is retryable (transient)
 */
export function isRetryableError(error: unknown): boolean {
  const errorType = classifyPrismaError(error);
  return errorType === DatabaseErrorType.CONNECTION;
}

/**
 * Executes a database operation with error handling and optional retry
 */
export async function executeWithErrorHandling<T>(
  operation: () => Promise<T>,
  context: {
    operation: string;
    model?: string;
    fallback?: T;
    retries?: number;
  }
): Promise<T> {
  const { operation: opName, model, fallback, retries = 0 } = context;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      lastError = error;
      const errorType = classifyPrismaError(error);

      // Logs the error
      logger.error(
        `Database operation failed: ${opName}${model ? ` on ${model}` : ""}`,
        error instanceof Error ? error : new Error(String(error)),
        {
          operation: opName,
          model,
          attempt: attempt + 1,
          maxRetries: retries,
          errorType,
          errorCode:
            error instanceof Prisma.PrismaClientKnownRequestError
              ? error.code
              : undefined,
        }
      );

      // Retries if error is retryable and attempts remain
      if (isRetryableError(error) && attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // Exponential backoff, max 5s
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Returns fallback if provided
      if (fallback !== undefined) {
        logger.warn(
          `Database operation failed, using fallback: ${opName}`,
          {
            operation: opName,
            model,
            errorType,
          }
        );
        return fallback;
      }

      // Re-throws error if no fallback
      throw error;
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError;
}

/**
 * Executes multiple database operations in a transaction
 * Provides atomicity and rollback on failure
 */
export async function executeTransaction<T>(
  operations: (tx: any) => Promise<T>,
  context: {
    operation: string;
    models?: string[];
  }
): Promise<T> {
  const { operation: opName, models } = context;
  const startTime = Date.now();

  try {
    const { prisma } = await import("@/lib/db");

    logger.debug(`Starting transaction: ${opName}`, {
      operation: opName,
      models: models || [],
    });

    const result = await prisma.$transaction(operations, {
      timeout: 10000, // 10 second timeout
    });

    const duration = Date.now() - startTime;
    logger.info(`Transaction completed: ${opName}`, {
      operation: opName,
      models: models || [],
      duration: `${duration}ms`,
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorType = classifyPrismaError(error);

    logger.error(
      `Transaction failed: ${opName}`,
      error instanceof Error ? error : new Error(String(error)),
      {
        operation: opName,
        models: models || [],
        duration: `${duration}ms`,
        errorType,
        errorCode:
          error instanceof Prisma.PrismaClientKnownRequestError
            ? error.code
            : undefined,
      }
    );

    // Re-throws error to allow caller to handle
    throw error;
  }
}

