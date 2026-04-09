import { Request, Response, NextFunction } from 'express';

/**
 * AppError Interface
 * Extends the default Error to include HTTP status codes
 */
interface AppError extends Error {
  statusCode?: number;
}

/**
 * Global Error Handler Middleware
 *
 * Catches all errors thrown in the application and returns a standardized
 * JSON response. This ensures that internal error details aren't leaked
 * to the client while providing meaningful error messages.
 *
 * Design Pattern: Middleware
 * SOLID Principle: Single Responsibility — centralizes all error response logic.
 */
const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error for debugging (In production, use a logger like Winston or Bunyan)
  console.error(`❌ [${req.method}] ${req.path} — Status: ${statusCode}`);
  console.error(`   Message: ${message}`);
  if (err.stack && process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
