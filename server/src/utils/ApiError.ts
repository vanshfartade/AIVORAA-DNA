// ============================================
// Custom API Error Class
// ============================================
// Operational errors thrown intentionally in the
// application flow. The error handler middleware
// distinguishes these from unexpected crashes.

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Restore prototype chain broken by extending builtins
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
