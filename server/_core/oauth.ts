// האותנטיקציה עברה ל-tRPC mutations ב-routers.ts
import type { Express } from "express";

export function registerOAuthRoutes(_app: Express) {
  // אין יותר OAuth routes - הלוגין עובד דרך tRPC
}
