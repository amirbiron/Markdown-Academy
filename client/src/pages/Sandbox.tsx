import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";

const defaultMarkdown = `# ברוכים הבאים לארגז החול! 🎨

כאן אתם יכולים לתרגל **Markdown** בחופשיות ללא הגבלה.

## דוגמאות מהירות

### רשימות
- פריט ראשון
- פריט שני
  - תת-פריט

### קישורים ותמונות
[לחץ כאן](https://example.com)

### קוד
\`\`\`javascript
console.log("Hello, Markdown!");
\`\`\`

### טבלה
| עמודה 1 | עמודה 2 |
|---------|---------|
| תא 1    | תא 2    |

נסו לערוך ולראות את התוצאות בזמן אמת! ✨
`;

export default function Sandbox() {
  const [value, setValue] = useState(defaultMarkdown);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30">
      {/* Header */}
      <header className="container py-4 border-b bg-card/50 backdrop-blur">
        <nav className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Code2 className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold gradient-text">Markdown Academy</h1>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/lessons">
              <Button variant="ghost" size="sm">שיעורים</Button>
            </Link>
            <Link href="/achievements">
              <Button variant="ghost" size="sm">הישגים</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">ארגז חול - תרגול חופשי</h2>
          <p className="text-muted-foreground">
            כתוב Markdown וראה את התוצאה בזמן אמת. כל השינויים נשמרים רק בדפדפן שלך.
          </p>
        </div>

        <MarkdownEditor value={value} onChange={setValue} height="calc(100vh - 250px)" />
      </main>
    </div>
  );
}
