// ============================================
// Express Request Type Extensions
// ============================================
// Augments the Express Request interface with
// custom properties set by middleware.

import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    /** User ID extracted from auth token. Set by auth middleware. */
    userId?: string;
  }
}
