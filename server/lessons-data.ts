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
      tip: "חשוב להשאיר שורה ריקה בין כותרת לפסקה, ובין פסקאות. בלי שורה ריקה, Markdown עלול לאחד את השורות לפסקה אחת.",
      commonMistakes: `<ul>
        <li>שכחת הרווח אחרי <code>#</code> — כתיבת <code>#כותרת</code> במקום <code># כותרת</code></li>
        <li>אי-השארת שורה ריקה בין פסקאות — הטקסט ימשיך באותה פסקה</li>
        <li>שימוש ביותר מ-6 סימני <code>#</code> — אין כותרת רמה 7</li>
      </ul>`,
      checkSolution: `<pre><code># דני כהן

שלום, אני דני. אני מתכנת ואוהב ללמוד דברים חדשים.

## תחומי עניין

אני אוהב תכנות, מוזיקה וטיולים בטבע.</code></pre>`,
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
      tip: "עדיף להשתמש ב-* במקום _ להדגשות, כי * עובד גם באמצע מילים בכל הפלטפורמות.",
      commonMistakes: `<ul>
        <li>שכחת סגירת כוכביות — <code>**טקסט</code> במקום <code>**טקסט**</code></li>
        <li>הוספת רווח בין הכוכביות לטקסט — <code>** טקסט **</code> לא יעבוד</li>
        <li>ערבוב _ ו-* באותה הדגשה — <code>**טקסט_</code> לא ייסגר נכון</li>
      </ul>`,
      checkSolution: `<pre><code>אני **אוהב** ללמוד *Markdown* כי זה ***פשוט***!</code></pre>`,
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
      tip: "ברשימות ממוספרות, Markdown מתקן את המספור אוטומטית. אפשר לכתוב 1. בכל שורה והוא ימספר נכון.",
      commonMistakes: `<ul>
        <li>הזחה לא מספקת לתת-רשימה — צריך לפחות 2 רווחים</li>
        <li>שכחת שורה ריקה לפני רשימה — חלק מהפרסרים דורשים שורה ריקה לפני רשימה</li>
        <li>ערבוב סמנים (<code>-</code> ו-<code>*</code>) באותה רשימה — עלול ליצור רשימות נפרדות</li>
      </ul>`,
      checkSolution: `<pre><code>1. תכנות
   - Python
   - JavaScript
2. מוזיקה
   - גיטרה
   - פסנתר
3. ספורט
   - כדורגל
   - שחייה</code></pre>`,
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
      tip: "אפשר גם ליצור קישורי הפניה (reference links) כדי לשמור על קריאות: [טקסט][1] ובתחתית הדף [1]: URL",
      commonMistakes: `<ul>
        <li>החלפת סוגריים — כתיבת <code>(טקסט)[url]</code> במקום <code>[טקסט](url)</code></li>
        <li>שכחת הפרוטוקול — <code>[קישור](example.com)</code> במקום <code>[קישור](https://example.com)</code></li>
        <li>רווח בין הסוגריים — <code>[טקסט] (url)</code> לא ייצור קישור</li>
      </ul>`,
      checkSolution: `<pre><code>[Google - מנוע חיפוש](https://www.google.com)

&lt;user@example.com&gt;</code></pre>`,
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
      tip: "כתוב טקסט חלופי תיאורי ומשמעותי — הוא חשוב לנגישות וגם מופיע אם התמונה לא נטענת.",
      commonMistakes: `<ul>
        <li>שכחת סימן הקריאה <code>!</code> — בלעדיו זה יהיה קישור רגיל ולא תמונה</li>
        <li>טקסט חלופי ריק <code>![](url)</code> — פוגע בנגישות</li>
        <li>שימוש ב-URL שבור — תמיד בדוק שהתמונה נטענת</li>
      </ul>`,
      checkSolution: `<pre><code>![נוף חוף הים בשקיעה](https://example.com/sunset-beach.jpg "שקיעה בחוף")</code></pre>`,
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
      tip: "לא חייבים ליישר את הקווים בטבלה — Markdown יעבד אותם נכון גם אם העמודות לא מיושרות בקוד המקור.",
      commonMistakes: `<ul>
        <li>שכחת שורת ההפרדה <code>|---|---|</code> — חובה בין הכותרות לשורות</li>
        <li>מספר עמודות לא אחיד — כל שורה חייבת לכלול אותו מספר <code>|</code></li>
        <li>שכחת הנקודתיים ביישור — <code>:---:</code> למרכז, <code>---:</code> לימין</li>
      </ul>`,
      checkSolution: `<pre><code>| שם הספר          | מחבר       | מחיר |
|:-----------------|:----------:|-----:|
| הנסיך הקטן       | סנט-אקזופרי |   45 |
| 1984             |  ג'ורג' אורוול |   55 |
| הארי פוטר        | ג'.ק. רולינג |   70 |</code></pre>`,
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
      tip: "אפשר להשתמש ב-4 רווחים בתחילת שורה במקום backticks לבלוק קוד, אבל backticks עדיפים כי הם תומכים בהדגשת תחביר.",
      commonMistakes: `<ul>
        <li>שימוש ב-backtick בודד לבלוק קוד — צריך 3 backticks לפני ואחרי</li>
        <li>שכחת סגירת בלוק הקוד — חייבים \`\`\` גם בסוף</li>
        <li>כתיבת שם שפה שגוי — <code>js</code> במקום <code>javascript</code> (שניהם עובדים, אבל כדאי להכיר)</li>
      </ul>`,
      checkSolution: `<pre><code>\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`</code></pre>`,
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
      tip: "אפשר לשלב עיצובים אחרים בתוך ציטוט — כותרות, רשימות, קוד ואפילו תמונות.",
      commonMistakes: `<ul>
        <li>שכחת רווח אחרי <code>&gt;</code> — כדאי להוסיף רווח לקריאות</li>
        <li>אי-הוספת <code>&gt;</code> בשורות ריקות בציטוט — הציטוט יישבר לשניים</li>
        <li>שימוש בפחות מ-3 מקפים לקו מפריד — <code>--</code> לא ייצור קו</li>
      </ul>`,
      checkSolution: `<pre><code>&gt; "הדרך הטובה ביותר לנבא את העתיד היא ליצור אותו"
&gt; — אלן קיי

---

&gt; שאלה מעניינת
&gt;&gt; תשובה לשאלה
&gt;&gt;&gt; תגובה לתשובה</code></pre>`,
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
      tip: "רשימות משימות ב-GitHub עובדות גם ב-Issues וב-Pull Requests, ומראות מד התקדמות אוטומטי.",
      commonMistakes: `<ul>
        <li>שכחת הרווח בין הסוגריים — <code>-[x]</code> במקום <code>- [x]</code></li>
        <li>שימוש ב-X גדולה — <code>- [X]</code> עובד, אבל <code>- [x]</code> הוא הסטנדרט</li>
        <li>שכחת הרווח בתוך הסוגריים למשימה פתוחה — <code>-[]</code> במקום <code>- [ ]</code></li>
      </ul>`,
      checkSolution: `<pre><code>- [x] למדתי כותרות ופסקאות
- [x] למדתי הדגשות טקסט
- [ ] ללמוד תרשימי Mermaid
- [ ] ללמוד HTML בתוך Markdown

~~השיעור על טבלאות בוטל~~</code></pre>`,
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
      tip: "אפשר להשתמש ב-graph LR לתרשים אופקי (שמאל לימין) או graph TD לתרשים אנכי (למעלה למטה).",
      commonMistakes: `<ul>
        <li>שכחת כתיבת <code>mermaid</code> אחרי ה-backticks — בלי זה הקוד יוצג כטקסט רגיל</li>
        <li>שימוש בסוגריים לא נכונים — <code>[]</code> למלבן, <code>{}</code> למעוין, <code>()</code> למלבן מעוגל</li>
        <li>שכחת חצים נכונים — <code>--></code> לחץ רגיל, <code>-->>></code> לא קיים</li>
      </ul>`,
      checkSolution: `<pre><code>\`\`\`mermaid
graph TD
    A[קימה בבוקר] --> B{יש קפה?}
    B -->|כן| C[להכין קפה]
    B -->|לא| D[לצאת לקנות]
    D --> C
    C --> E[לשתות ולהתחיל את היום]
\`\`\`</code></pre>`,
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
      tip: "לא כל פלטפורמות Markdown תומכות ב-HTML. GitHub תומך ברוב התגיות, אבל Slack למשל לא.",
      commonMistakes: `<ul>
        <li>שכחת סגירת תגיות HTML — <code>&lt;div&gt;</code> חייב <code>&lt;/div&gt;</code></li>
        <li>שכחת תגית <code>&lt;summary&gt;</code> ב-details — בלעדיה לא יהיה טקסט ללחיצה</li>
        <li>ערבוב Markdown בתוך HTML — צריך שורה ריקה בין HTML ל-Markdown כדי שזה יעבד</li>
      </ul>`,
      checkSolution: `<pre><code>&lt;img src="https://example.com/photo.jpg" width="400" alt="תמונה לדוגמה"&gt;

&lt;details&gt;
  &lt;summary&gt;לחץ לפרטים נוספים&lt;/summary&gt;

  כאן מוסבר עוד על הנושא. אפשר לכתוב כמה שרוצים.
&lt;/details&gt;</code></pre>`,
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
      tip: "הערות שוליים מופיעות תמיד בתחתית הדף, לא משנה איפה כתבת את ההגדרה שלהן בקוד המקור.",
      commonMistakes: `<ul>
        <li>שכחת ה-<code>^</code> בהפניה — <code>[1]</code> במקום <code>[^1]</code></li>
        <li>אי-התאמה בין ההפניה להגדרה — <code>[^1]</code> בטקסט אבל <code>[^2]:</code> בהגדרה</li>
        <li>שכחת הנקודתיים בהגדרה — <code>[^1]</code> במקום <code>[^1]:</code></li>
      </ul>`,
      checkSolution: `<pre><code>Markdown הוא כלי לכתיבת תוכן מעוצב[^1] בצורה פשוטה.
הוא נפוץ מאוד ב-GitHub[^2] ובפלטפורמות תיעוד.

[^1]: תוכן מעוצב (formatted content) — טקסט שכולל עיצובים כמו כותרות, הדגשות וקישורים.
[^2]: GitHub — פלטפורמה לניהול קוד מקור ושיתוף פעולה בין מפתחים.</code></pre>`,
    }),
  },
];
