export type TipCategory = "formatting" | "structure" | "github" | "advanced";

export interface InjectSnippet {
  label: string;
  snippet: string;
  /** היסט הסמן מתחילת ה-snippet לאחר ההזרקה */
  cursorOffset?: number;
}

export interface Tip {
  id: string;
  title: string;
  category: TipCategory;
  icon: string;
  description: string;
  /** תוכן Markdown שנטען לעורך כשבוחרים את הטיפ */
  markdownExample: string;
  /** כפתורי הזרקה מהירה ספציפיים לטיפ */
  injectSnippets?: InjectSnippet[];
}

export const tipCategories: Record<TipCategory, { label: string; icon: string }> = {
  formatting: { label: "עיצוב טקסט", icon: "Type" },
  structure: { label: "מבנה מסמך", icon: "LayoutList" },
  github: { label: "GitHub מיוחד", icon: "Github" },
  advanced: { label: "טריקים מתקדמים", icon: "Wand2" },
};

export const tipsData: Tip[] = [
  // --- formatting ---
  {
    id: "highlight-marker",
    title: "טקסט מסומן (Highlight)",
    category: "formatting",
    icon: "Highlighter",
    description: "סימון טקסט בצהוב עם סימני == כפולים",
    markdownExample: `# טקסט מסומן (Highlight)

אפשר ==לסמן טקסט חשוב== באמצעות סימני שוויון כפולים.

## דוגמאות

זהו ==טקסט מודגש בצהוב== שמושך את העין.

אפשר גם לשלב עם **==הדגשה כפולה==** לאפקט חזק יותר.

אפשר גם להשתמש בתגית HTML: <mark>טקסט מסומן עם mark</mark>

> **טיפ:** הסינטקס \`==טקסט==\` נפוץ ב-Markdown-it ו-Obsidian. תגית \`<mark>\` היא HTML סטנדרטי.
`,
    injectSnippets: [
      { label: "==Marker==", snippet: "==טקסט מסומן==", cursorOffset: 2 },
      { label: "<mark>", snippet: "<mark>טקסט מסומן</mark>", cursorOffset: 6 },
    ],
  },
  {
    id: "strikethrough",
    title: "קו חוצה (Strikethrough)",
    category: "formatting",
    icon: "Strikethrough",
    description: "מחיקת טקסט עם קו חוצה באמצעות ~~",
    markdownExample: `# קו חוצה (Strikethrough)

השתמשו בטילדות כפולות כדי ליצור ~~טקסט עם קו חוצה~~.

## דוגמאות

- ~~משימה שבוטלה~~
- המחיר הישן: ~~199 ש"ח~~ → מחיר חדש: **99 ש"ח**
- ~~טעות~~ תיקון

> **שימו לב:** זהו חלק מ-GitHub Flavored Markdown (GFM).
`,
    injectSnippets: [
      { label: "Strikethrough", snippet: "~~טקסט מחוק~~", cursorOffset: 2 },
    ],
  },
  {
    id: "line-breaks",
    title: "שבירות שורה",
    category: "formatting",
    icon: "WrapText",
    description: "איך לשבור שורות נכון - כלל שני הרווחים ותג <br>",
    markdownExample: `# שבירות שורה ב-Markdown

ב-Markdown, Enter רגיל לא שובר שורה!

## הדרכים לשבור שורה

### 1. שני רווחים בסוף השורה
שורה ראשונה
שורה שנייה (יש 2 רווחים בסוף השורה הקודמת)

### 2. תגית HTML
שורה ראשונה<br>שורה שנייה

### 3. שורה ריקה (פסקה חדשה)
פסקה ראשונה.

פסקה שנייה (יש שורה ריקה ביניהן).

> **טיפ:** שני רווחים בסוף שורה הם "בלתי נראים" - זה המלכוד הגדול של Markdown!
`,
    injectSnippets: [
      { label: "שבירת שורה (br)", snippet: "<br>\n" },
      { label: "שני רווחים", snippet: "  \n" },
    ],
  },
  {
    id: "kbd-tags",
    title: "מקשי מקלדת (KBD)",
    category: "formatting",
    icon: "Keyboard",
    description: "הצגת קיצורי מקלדת בסגנון כפתורים עם <kbd>",
    markdownExample: `# מקשי מקלדת עם KBD

השתמשו בתגית \`<kbd>\` כדי להציג מקשי מקלדת:

## דוגמאות

לחצו <kbd>Ctrl</kbd> + <kbd>C</kbd> כדי להעתיק.

שמירה: <kbd>Ctrl</kbd> + <kbd>S</kbd>

חיפוש: <kbd>Ctrl</kbd> + <kbd>F</kbd>

ביטול: <kbd>Ctrl</kbd> + <kbd>Z</kbd>

> **טיפ:** תגית \`<kbd>\` עובדת בכל מקום שתומך ב-HTML בתוך Markdown (כמו GitHub).
`,
    injectSnippets: [
      { label: "KBD", snippet: "<kbd>Key</kbd>", cursorOffset: 5 },
      { label: "Ctrl+", snippet: "<kbd>Ctrl</kbd> + <kbd>Key</kbd>", cursorOffset: 23 },
    ],
  },

  // --- structure ---
  {
    id: "footnotes",
    title: "הערות שוליים (Footnotes)",
    category: "structure",
    icon: "FootprintsIcon",
    description: "הוספת הפניות והערות שוליים בתחתית המסמך",
    markdownExample: `# הערות שוליים

הנה דוגמה לטקסט עם הערת שוליים[^1].

אפשר גם הערה עם שם[^note] במקום מספר.

## דוגמה מעשית

Markdown נוצר על ידי John Gruber[^2] בשנת 2004.
הוא נועד להיות קל לקריאה[^readability] וקל לכתיבה.

[^1]: זוהי הערת שוליים ממוספרת.
[^note]: אפשר להשתמש בשמות במקום מספרים.
[^2]: John Gruber הוא מפתח ובלוגר אמריקאי.
[^readability]: גם בפורמט הגולמי, Markdown נשאר קריא.
`,
    injectSnippets: [
      { label: "הערת שוליים", snippet: "[^1]", cursorOffset: 2 },
      { label: "הגדרת הערה", snippet: "\n[^1]: הערה כאן", cursorOffset: 6 },
    ],
  },
  {
    id: "nested-blockquotes",
    title: "ציטוטים מקוננים",
    category: "structure",
    icon: "Quote",
    description: "ציטוטים בתוך ציטוטים ליצירת שרשורי שיחה",
    markdownExample: `# ציטוטים מקוננים

> זהו ציטוט רמה 1
>> זהו ציטוט רמה 2
>>> וזהו ציטוט רמה 3

## דוגמה - שרשור שיחה

> **דני:** מה דעתכם על Markdown?
>> **שרה:** אני חושבת שזה מעולה!
>>> **דני:** אני מסכים, במיוחד בשביל תיעוד.

## שילוב עם עיצוב

> **חשוב:**
> - אפשר לשלב רשימות בתוך ציטוט
> - וגם \`קוד inline\`
>> ואפילו ציטוט מקונן עם **הדגשה**
`,
    injectSnippets: [
      { label: "ציטוט", snippet: "\n> ", cursorOffset: 3 },
      { label: "ציטוט מקונן", snippet: "\n>> ", cursorOffset: 4 },
    ],
  },
  {
    id: "collapsible-sections",
    title: "סעיפים מתקפלים",
    category: "structure",
    icon: "ChevronDown",
    description: "הסתרת תוכן ארוך בתוך אלמנט details מתקפל",
    markdownExample: `# סעיפים מתקפלים

השתמשו ב-\`<details>\` ו-\`<summary>\` כדי ליצור תוכן מתקפל:

<details>
<summary>לחצו כאן לפרטים נוספים</summary>

כאן אפשר לשים תוכן ארוך שלא צריך להיות גלוי כברירת מחדל.

- פריט 1
- פריט 2
- פריט 3

</details>

## דוגמה - FAQ

<details>
<summary><strong>מה זה Markdown?</strong></summary>

Markdown היא שפת סימון קלה שנוצרה על ידי John Gruber ב-2004.

</details>

<details>
<summary><strong>איפה משתמשים ב-Markdown?</strong></summary>

- GitHub
- Stack Overflow
- Discord
- Obsidian

</details>
`,
    injectSnippets: [
      {
        label: "Details",
        snippet: "<details>\n<summary>כותרת</summary>\n\nתוכן כאן\n\n</details>",
        cursorOffset: 19,
      },
    ],
  },

  // --- github ---
  {
    id: "task-lists",
    title: "רשימות משימות (Task Lists)",
    category: "github",
    icon: "CheckSquare",
    description: "יצירת רשימות עם תיבות סימון אינטראקטיביות",
    markdownExample: `# רשימות משימות

## פרויקט Markdown Academy

- [x] תכנון ראשוני
- [x] עיצוב UI
- [ ] פיתוח Backend
- [ ] בדיקות
- [ ] השקה

## רשימת קניות

- [x] חלב
- [x] לחם
- [ ] ביצים
- [ ] גבינה

> **טיפ:** ב-GitHub Issues, רשימות משימות מציגות מד התקדמות אוטומטי!
`,
    injectSnippets: [
      { label: "משימה פתוחה", snippet: "- [ ] " },
      { label: "משימה סגורה", snippet: "- [x] " },
    ],
  },
  {
    id: "github-alerts",
    title: "התראות GitHub",
    category: "github",
    icon: "AlertTriangle",
    description: "הודעות NOTE, TIP, WARNING ועוד בסגנון GitHub",
    markdownExample: `# התראות GitHub (Alerts)

GitHub תומך ב-5 סוגי התראות:

> [!NOTE]
> מידע שימושי שכדאי לשים לב אליו.

> [!TIP]
> עצה מועילה לשימוש טוב יותר.

> [!IMPORTANT]
> מידע קריטי שהמשתמש חייב לדעת.

> [!WARNING]
> אזהרה על בעיות פוטנציאליות.

> [!CAUTION]
> סכנה - פעולה שעלולה לגרום לנזק.
`,
    injectSnippets: [
      { label: "NOTE", snippet: "\n> [!NOTE]\n> " },
      { label: "TIP", snippet: "\n> [!TIP]\n> " },
      { label: "WARNING", snippet: "\n> [!WARNING]\n> " },
      { label: "IMPORTANT", snippet: "\n> [!IMPORTANT]\n> " },
      { label: "CAUTION", snippet: "\n> [!CAUTION]\n> " },
    ],
  },
  {
    id: "diff-syntax",
    title: "תחביר Diff (שינויי קוד)",
    category: "github",
    icon: "GitCompare",
    description: "הצגת שינויי קוד בירוק ואדום עם תחביר diff",
    markdownExample: `# תחביר Diff

השתמשו ב-\`\`\`diff כדי להציג שינויי קוד בצבע:

\`\`\`diff
- const oldVariable = "ישן";
+ const newVariable = "חדש";

  function example() {
-   console.log("before");
+   console.log("after");
  }
\`\`\`

## דוגמה - עדכון תלויות

\`\`\`diff
{
  "dependencies": {
-   "react": "^17.0.0",
+   "react": "^19.0.0",
-   "typescript": "^4.0.0"
+   "typescript": "^5.0.0"
  }
}
\`\`\`

> **טיפ:** שורות עם \`-\` מוצגות באדום, שורות עם \`+\` בירוק.
`,
    injectSnippets: [
      { label: "Diff Block", snippet: "\n```diff\n- שורה ישנה\n+ שורה חדשה\n```\n" },
    ],
  },

  // --- advanced ---
  {
    id: "hidden-comments",
    title: "הערות נסתרות",
    category: "advanced",
    icon: "EyeOff",
    description: "הוספת הערות שלא מוצגות בתצוגה המקדימה",
    markdownExample: `# הערות נסתרות ב-Markdown

אפשר להוסיף הערות שלא יוצגו בפלט:

<!-- זו הערה נסתרת שלא תוצג -->

הטקסט הזה מוצג רגיל.

<!--
  אפשר גם הערות
  מרובות שורות
-->

## שימושים נפוצים

1. תזכורות לעצמך <!-- TODO: להשלים את הפסקה -->
2. הסתרת טיוטות <!-- DRAFT: לא מוכן לפרסום -->
3. מטא-דאטה <!-- Author: John, Date: 2024-01-01 -->
`,
    injectSnippets: [
      { label: "הערה נסתרת", snippet: "<!-- הערה -->", cursorOffset: 5 },
    ],
  },
  {
    id: "non-breaking-spaces",
    title: "רווחים מיוחדים",
    category: "advanced",
    icon: "Space",
    description: "שליטה ברווחים עם HTML entities כמו &emsp; ו-&nbsp;",
    markdownExample: `# רווחים מיוחדים

Markdown "בולע" רווחים כפולים. הנה הפתרונות:

## סוגי רווחים

| שם | קוד | גודל |
|:---|:---|:---|
| רווח לא שובר | \`&nbsp;\` | רגיל |
| רווח Em | \`&emsp;\` | רחב |
| רווח En | \`&ensp;\` | בינוני |
| רווח דק | \`&thinsp;\` | צר |

## דוגמאות

רגיל: מילה מילה

עם&emsp;&emsp;&emsp;רווחים&emsp;&emsp;&emsp;רחבים

הזחה:&nbsp;&nbsp;&nbsp;&nbsp;טקסט מוזח

> **טיפ:** \`&nbsp;\` שימושי גם למניעת שבירת שורה בין שתי מילים.
`,
    injectSnippets: [
      { label: "&nbsp;", snippet: "&nbsp;" },
      { label: "&emsp;", snippet: "&emsp;" },
      { label: "&ensp;", snippet: "&ensp;" },
    ],
  },
];
