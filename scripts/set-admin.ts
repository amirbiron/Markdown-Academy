/**
 * סקריפט להקצאת/הסרת הרשאת admin למשתמש רשום לפי email.
 *
 * שימוש:
 *   npx tsx scripts/set-admin.ts <email>            # הקצאת admin
 *   npx tsx scripts/set-admin.ts <email> --revoke   # הסרת admin
 */
import "dotenv/config";
import { setUserRole, getUserByEmail } from "../server/db";

async function main() {
  const email = process.argv[2];
  const revoke = process.argv.includes("--revoke");

  if (!email) {
    console.error("שימוש: npx tsx scripts/set-admin.ts <email> [--revoke]");
    process.exit(1);
  }

  const user = await getUserByEmail(email);
  if (!user) {
    console.error(`משתמש עם האימייל ${email} לא נמצא. ודא שהמשתמש נרשם קודם.`);
    process.exit(1);
  }

  const role = revoke ? "user" : "admin";
  const updated = await setUserRole(email, role);

  if (updated) {
    console.log(`${user.name || email} עודכן ל-${role} בהצלחה.`);
  } else {
    console.error("העדכון נכשל.");
    process.exit(1);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
