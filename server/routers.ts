import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),

    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const user = await sdk.registerUser(input.email, input.password, input.name);

          const sessionToken = await sdk.createSessionToken(user.openId, {
            name: user.name || "",
            expiresInMs: ONE_YEAR_MS,
          });

          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

          return { success: true } as const;
        } catch (err: any) {
          if (err.message === "EMAIL_EXISTS") {
            throw new TRPCError({ code: "CONFLICT", message: "כתובת האימייל כבר רשומה במערכת" });
          }
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "שגיאה בהרשמה" });
        }
      }),

    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const user = await sdk.loginUser(input.email, input.password);

          const sessionToken = await sdk.createSessionToken(user.openId, {
            name: user.name || "",
            expiresInMs: ONE_YEAR_MS,
          });

          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

          return { success: true } as const;
        } catch (err: any) {
          if (err.message === "INVALID_CREDENTIALS") {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "אימייל או סיסמה שגויים" });
          }
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "שגיאה בהתחברות" });
        }
      }),

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
