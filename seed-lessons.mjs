// סקריפט זריעת שיעורים - יש להריץ עם: npx tsx seed-lessons.mjs
// מקור הנתונים: server/lessons-data.ts
import { drizzle } from "drizzle-orm/mysql2";
import { lessons } from "./drizzle/schema.ts";
import { lessonsData } from "./server/lessons-data.ts";
import "dotenv/config";

const db = drizzle(process.env.DATABASE_URL);

async function seedLessons() {
  console.log("Starting to seed lessons...");

  try {
    for (const lesson of lessonsData) {
      await db.insert(lessons).values(lesson);
      console.log(`✓ Added: ${lesson.title}`);
    }

    console.log("\n✅ All lessons seeded successfully!");
    console.log(`Total lessons: ${lessonsData.length}`);
  } catch (error) {
    console.error("❌ Error seeding lessons:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedLessons();
