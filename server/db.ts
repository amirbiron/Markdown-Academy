import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, lessons, userProgress, achievements, InsertLesson, InsertUserProgress, InsertAchievement } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
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
    } else if (ENV.ownerEmail && user.email === ENV.ownerEmail) {
      values.role = 'admin';
      updateSet.role = 'admin';
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

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Lesson queries
export async function getAllLessons() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(lessons).orderBy(lessons.category, lessons.orderIndex);
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
