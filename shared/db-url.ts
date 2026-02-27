/**
 * הוספת SSL ל-URL של חיבור MySQL אם חסר.
 * TiDB Cloud דורש חיבור SSL - פונקציה זו מוסיפה את הפרמטר אוטומטית.
 * אם ה-URL לא תקין, מוחזר הערך המקורי כמו שהוא.
 */
export function ensureSsl(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    if (!url.searchParams.has("ssl")) {
      url.searchParams.set("ssl", '{"rejectUnauthorized":true}');
    }
    return url.toString();
  } catch {
    return connectionString;
  }
}
