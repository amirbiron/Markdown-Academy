import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, lessons, userProgress, achievements, InsertLesson, InsertUserProgress, InsertAchievement } from "../drizzle/schema";
import { ENV } from './_core/env';
import { ensureSsl } from '../shared/db-url';
import { lessonsData } from "./lessons-data";

let _db: ReturnType<typeof drizzle> | null = null;

// מונע זריעה מקבילית - אם כבר רץ תהליך זריעה, ננצל אותו
let _seedingPromise: Promise<void> | null = null;

function getConnectionUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  return ensureSsl(raw);
}

export async function getDb() {
  if (!_db) {
    const connUrl = getConnectionUrl();
    if (!connUrl) return null;
    try {
      _db = drizzle(connUrl);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "passwordHash", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/** INSERT בלבד — זורק שגיאה אם email/openId כבר קיים */
export async function insertUser(user: InsertUser): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(users).values({
    openId: user.openId,
    name: user.name ?? null,
    email: user.email ?? null,
    passwordHash: user.passwordHash ?? null,
    loginMethod: user.loginMethod ?? null,
    lastSignedIn: user.lastSignedIn ?? new Date(),
  });
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/** עדכון role של משתמש לפי email */
export async function setUserRole(email: string, role: "user" | "admin"): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.update(users).set({ role }).where(eq(users.email, email));
  return (result[0] as any).affectedRows > 0;
}

// זריעת שיעורים בתוך טרנזקציה - אטומי ובטוח מפני race conditions
async function seedLessonsIfEmpty(db: NonNullable<Awaited<ReturnType<typeof getDb>>>) {
  if (_seedingPromise) {
    await _seedingPromise;
    return;
  }

  _seedingPromise = (async () => {
    try {
      await db.transaction(async (tx) => {
        // בדיקה כפולה בתוך הטרנזקציה - למקרה שבקשה אחרת כבר זרעה
        const existing = await tx.select({ count: sql<number>`count(*)` }).from(lessons);
        if (existing[0].count > 0) return;

        for (const lesson of lessonsData) {
          await tx.insert(lessons).values(lesson);
        }
        console.log(`[Database] זריעה אוטומטית של ${lessonsData.length} שיעורים`);
      });
    } catch (error) {
      console.error("[Database] שגיאה בזריעת שיעורים:", error);
    } finally {
      _seedingPromise = null;
    }
  })();

  await _seedingPromise;
}

// סנכרון תוכן שיעורים - מעדכן שיעורים קיימים אם התוכן בקוד השתנה
let _syncDone = false;
async function syncLessonsContent(db: NonNullable<Awaited<ReturnType<typeof getDb>>>) {
  if (_syncDone) return;
  _syncDone = true;

  try {
    const existing = await db.select().from(lessons).orderBy(lessons.category, lessons.orderIndex);
    for (const lesson of existing) {
      const match = lessonsData.find(
        (d) => d.category === lesson.category && d.orderIndex === lesson.orderIndex,
      );
      if (match && match.content !== lesson.content) {
        await db.update(lessons).set({ content: match.content }).where(eq(lessons.id, lesson.id));
      }
    }
  } catch (error) {
    console.error("[Database] שגיאה בסנכרון תוכן שיעורים:", error);
    _syncDone = false;
  }
}

// Lesson queries
export async function getAllLessons() {
  const db = await getDb();
  if (!db) return [];

  let result = await db.select().from(lessons).orderBy(lessons.category, lessons.orderIndex);

  // אם טבלת השיעורים ריקה, נזרע אותה אוטומטית
  if (result.length === 0) {
    await seedLessonsIfEmpty(db);
    result = await db.select().from(lessons).orderBy(lessons.category, lessons.orderIndex);
  } else {
    // סנכרון תוכן - מעדכן שיעורים קיימים אם התוכן בקוד השתנה (רץ פעם אחת בהפעלה)
    if (!_syncDone) {
      await syncLessonsContent(db);
      result = await db.select().from(lessons).orderBy(lessons.category, lessons.orderIndex);
    }
  }

  return result;
}

export async function getLessonById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createLesson(lesson: InsertLesson) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(lessons).values(lesson);
  return result;
}

// User progress queries
export async function getUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  return result;
}

export async function getLessonProgress(userId: number, lessonId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertProgress(progress: InsertUserProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getLessonProgress(progress.userId, progress.lessonId);
  
  if (existing) {
    await db.update(userProgress)
      .set({
        completed: progress.completed,
        completedAt: progress.completedAt,
        exerciseData: progress.exerciseData,
        updatedAt: new Date(),
      })
      .where(eq(userProgress.id, existing.id));
  } else {
    await db.insert(userProgress).values(progress);
  }
}

// Achievement queries
export async function getUserAchievements(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(achievements)
    .where(eq(achievements.userId, userId))
    .orderBy(desc(achievements.earnedAt));
  
  return result;
}

export async function createAchievement(achievement: InsertAchievement) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(achievements).values(achievement);
}

export async function hasAchievement(userId: number, achievementType: string) {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.select().from(achievements)
    .where(and(eq(achievements.userId, userId), eq(achievements.achievementType, achievementType)))
    .limit(1);
  
  return result.length > 0;
}
