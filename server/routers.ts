import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  lessons: router({
    list: publicProcedure.query(async () => {
      const lessons = await db.getAllLessons();
      return lessons;
    }),
    
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const lesson = await db.getLessonById(input.id);
        return lesson;
      }),
  }),

  progress: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const progress = await db.getUserProgress(ctx.user.id);
      return progress;
    }),
    
    get: protectedProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ ctx, input }) => {
        const progress = await db.getLessonProgress(ctx.user.id, input.lessonId);
        return progress || null;
      }),
    
    complete: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
        exerciseData: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertProgress({
          userId: ctx.user.id,
          lessonId: input.lessonId,
          completed: true,
          completedAt: new Date(),
          exerciseData: input.exerciseData,
        });
        
        // Check for achievements
        const allProgress = await db.getUserProgress(ctx.user.id);
        const completedCount = allProgress.filter(p => p.completed).length;
        
        // First lesson achievement
        if (completedCount === 1 && !(await db.hasAchievement(ctx.user.id, "first_lesson"))) {
          await db.createAchievement({
            userId: ctx.user.id,
            achievementType: "first_lesson",
          });
        }
        
        // Halfway achievement
        const allLessons = await db.getAllLessons();
        if (completedCount >= Math.floor(allLessons.length / 2) && 
            !(await db.hasAchievement(ctx.user.id, "halfway"))) {
          await db.createAchievement({
            userId: ctx.user.id,
            achievementType: "halfway",
          });
        }
        
        // All complete achievement
        if (completedCount === allLessons.length && 
            !(await db.hasAchievement(ctx.user.id, "all_complete"))) {
          await db.createAchievement({
            userId: ctx.user.id,
            achievementType: "all_complete",
          });
        }
        
        return { success: true };
      }),
  }),

  achievements: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const achievements = await db.getUserAchievements(ctx.user.id);
      return achievements;
    }),
  }),
});

export type AppRouter = typeof appRouter;
