# Markdown Academy

פלטפורמה בעברית ללימוד Markdown, עם שיעורים מדורגים, עורך עם תצוגה מקדימה חיה, ארגז כלים ומעקב התקדמות והישגים.

## טכנולוגיות

React, ‏Vite ו-Tailwind בצד הלקוח, ‏Express ו-tRPC בצד השרת, ו-MySQL עם Drizzle ORM למסד הנתונים.

## הרצה מקומית

נדרשים Node.js, ‏pnpm ומסד נתונים MySQL.

יוצרים קובץ `.env` עם המשתנים האלה:

```
DATABASE_URL=mysql://user:password@host:3306/database
JWT_SECRET=מחרוזת-אקראית-ארוכה
```

ואז מריצים:

```bash
pnpm install
pnpm db:push
npx tsx seed-lessons.mjs
pnpm dev
```

## פקודות נוספות

- `pnpm build`: בנייה לפרודקשן
- `pnpm start`: הרצת הגרסה הבנויה
- `pnpm test`: הרצת הבדיקות
- `pnpm check`: בדיקת טיפוסים
- `pnpm set-admin`: הגדרת משתמש כמנהל

## פריסה

הפריסה ל-Render מוגדרת בקובץ `render.yaml`. את `DATABASE_URL` מזינים ידנית, ו-`JWT_SECRET` נוצר אוטומטית.
