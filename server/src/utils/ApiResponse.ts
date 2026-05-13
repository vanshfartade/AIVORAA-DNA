// ============================================
// Standardized API Response Wrapper
// ============================================
// Ensures every successful response follows
// the { success: true, data, message? } format.

export class ApiResponse<T> {
  public readonly success: true;
  public readonly data: T;
  public readonly message: string;

  constructor(data: T, message = 'Success') {
    this.success = true;
    this.data = data;
    this.message = message;
  }
}
