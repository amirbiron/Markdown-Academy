import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(user?: AuthenticatedUser): TrpcContext {
  const ctx: TrpcContext = {
    user: user || null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

const mockUser: AuthenticatedUser = {
  id: 999,
  openId: "test-user",
  email: "test@example.com",
  name: "Test User",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("lessons.list", () => {
  it("returns all lessons without authentication", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const lessons = await caller.lessons.list();

    expect(lessons).toBeDefined();
    expect(Array.isArray(lessons)).toBe(true);
    expect(lessons.length).toBeGreaterThan(0);
  });

  it("returns lessons with correct structure", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const lessons = await caller.lessons.list();
    const firstLesson = lessons[0];

    expect(firstLesson).toHaveProperty("id");
    expect(firstLesson).toHaveProperty("title");
    expect(firstLesson).toHaveProperty("category");
    expect(firstLesson).toHaveProperty("orderIndex");
    expect(firstLesson).toHaveProperty("description");
    expect(firstLesson).toHaveProperty("content");
    expect(firstLesson).toHaveProperty("duration");
  });

  it("returns lessons ordered by category and orderIndex", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const lessons = await caller.lessons.list();
    
    // Check that basics come first
    const firstLesson = lessons[0];
    expect(firstLesson?.category).toBe("basics");
  });
});

describe("lessons.get", () => {
  it("returns a specific lesson by id", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const allLessons = await caller.lessons.list();
    const firstLessonId = allLessons[0]?.id;

    if (!firstLessonId) {
      throw new Error("No lessons found in database");
    }

    const lesson = await caller.lessons.get({ id: firstLessonId });

    expect(lesson).toBeDefined();
    expect(lesson?.id).toBe(firstLessonId);
  });

  it("returns undefined for non-existent lesson", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const lesson = await caller.lessons.get({ id: 99999 });

    expect(lesson).toBeUndefined();
  });
});

describe("progress.complete", () => {
  it("marks a lesson as complete for authenticated user", async () => {
    const ctx = createMockContext(mockUser);
    const caller = appRouter.createCaller(ctx);

    const allLessons = await caller.lessons.list();
    const firstLessonId = allLessons[0]?.id;

    if (!firstLessonId) {
      throw new Error("No lessons found in database");
    }

    const result = await caller.progress.complete({
      lessonId: firstLessonId,
      exerciseData: "test exercise data",
    });

    expect(result.success).toBe(true);

    // Verify progress was saved
    const progress = await caller.progress.get({ lessonId: firstLessonId });
    expect(progress?.completed).toBe(true);
    expect(progress?.lessonId).toBe(firstLessonId);
  });

  it("awards first_lesson achievement on first completion", async () => {
    const ctx = createMockContext(mockUser);
    const caller = appRouter.createCaller(ctx);

    const allLessons = await caller.lessons.list();
    const firstLessonId = allLessons[0]?.id;

    if (!firstLessonId) {
      throw new Error("No lessons found in database");
    }

    await caller.progress.complete({
      lessonId: firstLessonId,
    });

    const achievements = await caller.achievements.list();
    const hasFirstLesson = achievements.some(a => a.achievementType === "first_lesson");

    expect(hasFirstLesson).toBe(true);
  });
});

describe("progress.list", () => {
  it("returns empty array for user with no progress", async () => {
    const newUser: AuthenticatedUser = {
      ...mockUser,
      id: 888,
      openId: "new-user",
    };
    const ctx = createMockContext(newUser);
    const caller = appRouter.createCaller(ctx);

    const progress = await caller.progress.list();

    expect(Array.isArray(progress)).toBe(true);
  });
});
