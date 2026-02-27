// נתוני השיעורים - משמשים לזריעה אוטומטית אם טבלת השיעורים ריקה
import type { InsertLesson } from "../drizzle/schema";

export const lessonsData: Omit<InsertLesson, "id" | "createdAt" | "updatedAt">[] = [
  // יסודות - שיעורים קצרים של דקה
  {
    title: "כותרות ופסקאות",
    category: "basics",
    orderIndex: 1,
    description: "למד ליצור כותרות בגדלים שונים ופסקאות טקסט",
    duration: 1,
    content: JSON.stringify({
      theory: `
        <h3>כותרות</h3>
        <p>ב-Markdown, כותרות נוצרות באמצעות סימן <code>#</code>. ככל שיש יותר סימנים, הכותרת קטנה יותר:</p>
        <pre><code># כותרת רמה 1 (הגדולה ביותר)
## כותרת רמה 2
### כותרת רמה 3
#### כותרת רמה 4
##### כותרת רמה 5
###### כותרת רמה 6 (הקטנה ביותר)</code></pre>

        <h3>פסקאות</h3>
        <p>פסקאות נכתבות פשוט כטקסט רגיל. כדי להפריד בין פסקאות, השאירו שורה ריקה ביניהן.</p>
        <pre><code>זוהי פסקה ראשונה.

זוהי פסקה שנייה.</code></pre>
      `,
      examples: `
        <h4>דוגמה:</h4>
        <pre><code># ברוכים הבאים למדריך Markdown

זהו מסמך לדוגמה שמראה איך להשתמש בכותרות ופסקאות.

## למה Markdown?

Markdown היא שפת סימון קלה ופשוטה שמאפשרת לכתוב תוכן מעוצב בקלות.</code></pre>
      `,
      exercise: "נסה ליצור כותרת ראשית עם השם שלך, ואז כתוב פסקה קצרה על עצמך. אחר כך הוסף כותרת משנית 'תחומי עניין' ופסקה נוספת.",
    }),
  },
  {
    title: "הדגשות טקסט",
    category: "basics",
    orderIndex: 2,
    description: "למד להדגיש טקסט עם Bold, Italic ושילובים",
    duration: 1,
    content: JSON.stringify({
      theory: `
        <h3>הדגשות בסיסיות</h3>
        <p>ישנן שלוש דרכים עיקריות להדגיש טקסט ב-Markdown:</p>

        <h4>Bold (מודגש)</h4>
        <pre><code>**טקסט מודגש**
__טקסט מודגש__</code></pre>

        <h4>Italic (נטוי)</h4>
        <pre><code>*טקסט נטוי*
_טקסט נטוי_</code></pre>

        <h4>Bold + Italic</h4>
        <pre><code>***טקסט מודגש ונטוי***
**_או ככה_**
__*או ככה*__</code></pre>
      `,
      examples: `
        <h4>דוגמה:</h4>
        <pre><code>זהו **טקסט חשוב** שצריך לשים לב אליו.
זהו *טקסט עם דגש קל*.
זהו ***טקסט חשוב מאוד***!</code></pre>
      `,
      exercise: "כתוב משפט שמכיל מילה אחת ב-Bold, מילה אחת ב-Italic, ומילה אחת ב-Bold+Italic.",
    }),
  },
  {
    title: "רשימות",
    category: "basics",
    orderIndex: 3,
    description: "צור רשימות ממוספרות ולא ממוספרות",
    duration: 1,
    content: JSON.stringify({
      theory: `
        <h3>רשימה לא ממוספרת</h3>
        <p>השתמש ב-<code>-</code>, <code>*</code> או <code>+</code> בתחילת השורה:</p>
        <pre><code>- פריט ראשון
- פריט שני
- פריט שלישי</code></pre>

        <h3>רשימה ממוספרת</h3>
        <pre><code>1. פריט ראשון
2. פריט שני
3. פריט שלישי</code></pre>

        <h3>רשימות מקוננות</h3>
        <p>הוסף 2-4 רווחים לפני הפריט כדי ליצור תת-רשימה:</p>
        <pre><code>- פריט ראשי
  - תת-פריט 1
  - תת-פריט 2
- פריט ראשי נוסף</code></pre>
      `,
      examples: `
        <h4>דוגמה:</h4>
        <pre><code>רשימת קניות:
- ירקות
  - עגבניות
  - מלפפונים
- פירות
  - תפוחים
  - בננות</code></pre>
      `,
      exercise: "צור רשימה ממוספרת של 3 דברים שאתה אוהב, ותחת כל אחד הוסף תת-רשימה לא ממוספרת עם 2 פרטים.",
    }),
  },
  {
    title: "קישורים",
    category: "basics",
    orderIndex: 4,
    description: "הוסף קישורים לאתרים ומסמכים",
    duration: 1,
    content: JSON.stringify({
      theory: `
        <h3>קישור בסיסי</h3>
        <pre><code>[טקסט הקישור](https://example.com)</code></pre>

        <h3>קישור עם כותרת</h3>
        <p>הכותרת מופיעה כאשר מרחפים מעל הקישור:</p>
        <pre><code>[טקסט הקישור](https://example.com "כותרת הקישור")</code></pre>

        <h3>קישור ישיר</h3>
        <p>כתובת URL מוקפת ב-<code>&lt;&gt;</code> הופכת לקישור אוטומטית:</p>
        <pre><code>&lt;https://example.com&gt;</code></pre>
      `,
      examples: `
        <h4>דוגמה:</h4>
        <pre><code>בקר ב[אתר שלנו](https://example.com) למידע נוסף.
או שלח לנו מייל: &lt;info@example.com&gt;</code></pre>
      `,
      exercise: "צור קישור לאתר האהוב עליך עם טקסט תיאורי, ואז הוסף קישור ישיר למייל.",
    }),
  },
  {
    title: "תמונות",
    category: "basics",
    orderIndex: 5,
    description: "הוסף תמונות למסמך שלך",
    duration: 1,
    content: JSON.stringify({
      theory: `
        <h3>הוספת תמונה</h3>
        <p>התחביר דומה לקישור, רק עם <code>!</code> בהתחלה:</p>
        <pre><code>![טקסט חלופי](https://example.com/image.jpg)</code></pre>

        <h3>תמונה עם כותרת</h3>
        <pre><code>![טקסט חלופי](https://example.com/image.jpg "כותרת התמונה")</code></pre>

        <p><strong>טיפ:</strong> הטקסט החלופי חשוב לנגישות ומופיע אם התמונה לא נטענת.</p>
      `,
      examples: `
        <h4>דוגמה:</h4>
        <pre><code>![לוגו של החברה](https://example.com/logo.png "הלוגו שלנו")

תמונה יפה מהחופשה:
![נוף הרים](https://example.com/mountains.jpg)</code></pre>
      `,
      exercise: "הוסף תמונה (אפשר להשתמש ב-URL דמה) עם טקסט חלופי תיאורי.",
    }),
  },

  // בינוני - שיעורים ארוכים יותר
  {
    title: "טבלאות מתקדמות",
    category: "intermediate",
    orderIndex: 1,
    description: "צור טבלאות מורכבות עם יישור עמודות",
    duration: 2,
    content: JSON.stringify({
      theory: `
        <h3>מבנה טבלה בסיסי</h3>
        <pre><code>| כותרת 1 | כותרת 2 | כותרת 3 |
|----------|----------|----------|
| תא 1     | תא 2     | תא 3     |
| תא 4     | תא 5     | תא 6     |</code></pre>

        <h3>יישור עמודות</h3>
        <p>שנה את הקו המפריד כדי לשלוט ביישור:</p>
        <ul>
          <li><code>:---</code> - יישור לשמאל (ברירת מחדל)</li>
          <li><code>:---:</code> - יישור למרכז</li>
          <li><code>---:</code> - יישור לימין</li>
        </ul>

        <pre><code>| שם       | גיל  | עיר      |
|:---------|:----:|---------:|
| דני      | 25   | תל אביב  |
| שרה      | 30   | ירושלים  |</code></pre>
      `,
      examples: `
        <h4>דוגמה מתקדמת:</h4>
        <pre><code>| מוצר          | מחיר | זמינות |
|:--------------|-----:|:------:|
| מחשב נייד     | 3000 |   ✓    |
| עכבר          |   50 |   ✓    |
| מקלדת         |  150 |   ✗    |</code></pre>
      `,
      exercise: "צור טבלה של 3 ספרים עם עמודות: שם הספר (יישור שמאל), מחבר (מרכז), ומחיר (ימין).",
    }),
  },
  {
    title: "קוד ו-Code Blocks",
    category: "intermediate",
    orderIndex: 2,
    description: "הצג קוד עם הדגשת תחביר",
    duration: 2,
    content: JSON.stringify({
      theory: `
        <h3>קוד בשורה</h3>
        <p>עטוף טקסט ב-backticks בודדים:</p>
        <pre><code>השתמש בפונקציה \`console.log()\` כדי להדפיס.</code></pre>

        <h3>בלוק קוד</h3>
        <p>השתמש ב-3 backticks לפני ואחרי הקוד:</p>
        <pre><code>\`\`\`
function hello() {
  console.log("Hello!");
}
\`\`\`</code></pre>

        <h3>הדגשת תחביר</h3>
        <p>הוסף את שם השפה אחרי ה-backticks הפותחים:</p>
        <pre><code>\`\`\`javascript
const name = "Markdown";
console.log(\`Hello, \${name}!\`);
\`\`\`</code></pre>
      `,
      examples: `
        <h4>דוגמה:</h4>
        <pre><code>\`\`\`python
def greet(name):
    return f"שלום, {name}!"

print(greet("עולם"))
\`\`\`</code></pre>
      `,
      exercise: "כתוב בלוק קוד בשפת התכנות האהובה עליך עם הדגשת תחביר.",
    }),
  },
  {
    title: "ציטוטים וקווים מפרידים",
    category: "intermediate",
    orderIndex: 3,
    description: "הוסף ציטוטים וקווים אופקיים",
    duration: 1,
    content: JSON.stringify({
      theory: `
        <h3>ציטוטים</h3>
        <p>השתמש ב-<code>&gt;</code> בתחילת השורה:</p>
        <pre><code>&gt; זהו ציטוט
&gt; שממשיך לשורה נוספת</code></pre>

        <h3>ציטוטים מקוננים</h3>
        <pre><code>&gt; ציטוט רמה 1
&gt;&gt; ציטוט רמה 2
&gt;&gt;&gt; ציטוט רמה 3</code></pre>

        <h3>קו מפריד</h3>
        <p>השתמש ב-3 או יותר מקפים, כוכביות או קווים תחתונים:</p>
        <pre><code>---
***
___</code></pre>
      `,
      examples: `
        <h4>דוגמה:</h4>
        <pre><code>&gt; "הדמיון חשוב יותר מידע"
&gt; - אלברט איינשטיין

---

&gt; ציטוט נוסף
&gt;&gt; עם תגובה מקוננת</code></pre>
      `,
      exercise: "צור ציטוט של משפט אהוב עליך, הוסף קו מפריד, ואז הוסף ציטוט מקונן.",
    }),
  },

  // מתקדם - טריקים מתקדמים
  {
    title: "GitHub Flavored Markdown (GFM)",
    category: "advanced",
    orderIndex: 1,
    description: "רשימות משימות, אזכורים וקישורים אוטומטיים",
    duration: 3,
    content: JSON.stringify({
      theory: `
        <h3>רשימות משימות (Task Lists)</h3>
        <p>צור רשימות עם תיבות סימון:</p>
        <pre><code>- [x] משימה שהושלמה
- [ ] משימה פתוחה
- [ ] משימה נוספת</code></pre>

        <h3>קישורים אוטומטיים</h3>
        <p>URLs ומיילים הופכים לקישורים אוטומטית:</p>
        <pre><code>https://github.com
user@example.com</code></pre>

        <h3>Strikethrough (קו חוצה)</h3>
        <pre><code>~~טקסט מחוק~~</code></pre>

        <h3>אזכור משתמשים</h3>
        <p>ב-GitHub, השתמש ב-<code>@username</code> לאזכור משתמשים.</p>
      `,
      examples: `
        <h4>דוגמה:</h4>
        <pre><code>## רשימת משימות לפרויקט

- [x] תכנון ראשוני
- [x] עיצוב UI
- [ ] פיתוח Backend
- [ ] בדיקות

~~המשימה הזו בוטלה~~

צור קשר: support@example.com</code></pre>
      `,
      exercise: "צור רשימת משימות של 4 פריטים (2 מסומנים, 2 לא), והוסף טקסט מחוק.",
    }),
  },
  {
    title: "תרשימי Mermaid",
    category: "advanced",
    orderIndex: 2,
    description: "צור תרשימי זרימה וגרפים ישירות ב-Markdown",
    duration: 3,
    content: JSON.stringify({
      theory: `
        <h3>מהו Mermaid?</h3>
        <p>Mermaid מאפשר ליצור תרשימים ישירות מתוך Markdown באמצעות תחביר טקסטואלי.</p>

        <h3>תרשים זרימה בסיסי</h3>
        <pre><code>\`\`\`mermaid
graph TD
    A[התחלה] --> B{החלטה}
    B -->|כן| C[פעולה 1]
    B -->|לא| D[פעולה 2]
    C --> E[סוף]
    D --> E
\`\`\`</code></pre>

        <h3>תרשים Sequence</h3>
        <pre><code>\`\`\`mermaid
sequenceDiagram
    משתמש->>שרת: בקשה
    שרת->>DB: שאילתה
    DB-->>שרת: תוצאה
    שרת-->>משתמש: תגובה
\`\`\`</code></pre>
      `,
      examples: `
        <h4>דוגמה:</h4>
        <pre><code>\`\`\`mermaid
graph LR
    A[קוד] --> B[בדיקה]
    B --> C[Deploy]
    C --> D[Production]
\`\`\`</code></pre>
      `,
      exercise: "צור תרשים זרימה פשוט של תהליך שאתה מכיר (למשל: הכנת קפה, תהליך רכישה, וכו').",
    }),
  },
  {
    title: "HTML בתוך Markdown",
    category: "advanced",
    orderIndex: 3,
    description: "שלב תגיות HTML לעיצוב מתקדם",
    duration: 2,
    content: JSON.stringify({
      theory: `
        <h3>מתי להשתמש ב-HTML?</h3>
        <p>Markdown מוגבל בכוונה. כאשר צריך עיצוב מתקדם, אפשר לשלב HTML:</p>

        <h3>דוגמאות נפוצות</h3>

        <h4>תמונה עם גודל מותאם</h4>
        <pre><code>&lt;img src="image.jpg" width="300" alt="תיאור"&gt;</code></pre>

        <h4>טקסט צבעוני</h4>
        <pre><code>&lt;span style="color: red;"&gt;טקסט אדום&lt;/span&gt;</code></pre>

        <h4>יישור למרכז</h4>
        <pre><code>&lt;div align="center"&gt;
  תוכן ממורכז
&lt;/div&gt;</code></pre>

        <h4>פרטים מתקפלים</h4>
        <pre><code>&lt;details&gt;
  &lt;summary&gt;לחץ להרחבה&lt;/summary&gt;
  תוכן נסתר
&lt;/details&gt;</code></pre>
      `,
      examples: `
        <h4>דוגמה:</h4>
        <pre><code>&lt;div align="center"&gt;
  &lt;h2&gt;כותרת ממורכזת&lt;/h2&gt;
  &lt;img src="logo.png" width="200"&gt;
&lt;/div&gt;

&lt;details&gt;
  &lt;summary&gt;מידע נוסף&lt;/summary&gt;
  כאן אפשר להוסיף תוכן ארוך שיהיה נסתר כברירת מחדל.
&lt;/details&gt;</code></pre>
      `,
      exercise: "צור תמונה עם גודל מותאם אישית ואלמנט details עם תוכן נסתר.",
    }),
  },
  {
    title: "Footnotes וקיצורי מקלדת",
    category: "advanced",
    orderIndex: 4,
    description: "הערות שוליים וטריקים למהירות כתיבה",
    duration: 2,
    content: JSON.stringify({
      theory: `
        <h3>הערות שוליים (Footnotes)</h3>
        <p>הוסף הפניות בתוך הטקסט:</p>
        <pre><code>זהו טקסט עם הערת שוליים[^1].

[^1]: זוהי הערת השוליים.</code></pre>

        <h3>קיצורי מקלדת נפוצים</h3>
        <ul>
          <li><strong>Ctrl/Cmd + B</strong> - Bold</li>
          <li><strong>Ctrl/Cmd + I</strong> - Italic</li>
          <li><strong>Ctrl/Cmd + K</strong> - הוספת קישור</li>
          <li><strong>Ctrl/Cmd + Shift + K</strong> - בלוק קוד</li>
        </ul>

        <h3>טריקים למהירות</h3>
        <ul>
          <li>השתמש ב-<code>---</code> לקו מפריד מהיר</li>
          <li>כתוב <code>[]</code> ואז <code>()</code> לקישור מהיר</li>
          <li>העתק URL ובחר טקסט - הדבק יהפוך אותו לקישור</li>
        </ul>
      `,
      examples: `
        <h4>דוגמה:</h4>
        <pre><code>Markdown נוצר על ידי John Gruber[^1] בשנת 2004.

הוא נועד להיות קל לקריאה[^2] וקל לכתיבה.

[^1]: John Gruber הוא מפתח ובלוגר אמריקאי.
[^2]: גם בפורמט הגולמי, Markdown נשאר קריא.</code></pre>
      `,
      exercise: "כתוב פסקה עם 2 הערות שוליים שמסבירות מושגים טכניים.",
    }),
  },
];
