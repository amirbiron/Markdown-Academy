import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Code2, Wrench } from "lucide-react";
import { Link } from "wouter";
import { tipsData, type Tip } from "@/data/tips-data";
import ToolboxSidebar from "@/components/toolbox/ToolboxSidebar";
import ToolboxGrid from "@/components/toolbox/ToolboxGrid";
import ToolboxPlayground from "@/components/toolbox/ToolboxPlayground";
import { useIsMobile } from "@/hooks/useMobile";

export default function Toolbox() {
  const [mode, setMode] = useState<"grid" | "playground">("grid");
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const isMobile = useIsMobile();

  /* סינון טיפים לפי חיפוש */
  const filteredTips = useMemo(() => {
    if (!searchQuery.trim()) return tipsData;
    const q = searchQuery.trim().toLowerCase();
    return tipsData.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  /** בחירת טיפ - מפעיל את ה-Playground */
  function handleSelectTip(tip: Tip) {
    setSelectedTip(tip);
    setEditorValue(tip.markdownExample);
    setMode("playground");
  }

  /** חזרה מ-Playground לגריד */
  function handleBack() {
    setMode("grid");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30">
      {/* Header */}
      <header className="container py-4 border-b bg-card/50 backdrop-blur sticky top-0 z-30">
        <nav className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Code2 className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold gradient-text">Markdown Academy</h1>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {/* כפתור סיידבר במובייל */}
            {isMobile && (
              <ToolboxSidebar
                tips={filteredTips}
                selectedTipId={selectedTip?.id ?? null}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSelectTip={handleSelectTip}
              />
            )}
            <Link href="/lessons">
              <Button variant="ghost" size="sm">שיעורים</Button>
            </Link>
            <Link href="/sandbox">
              <Button variant="ghost" size="sm">ארגז חול</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container py-6">
        {/* כותרת העמוד */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="h-7 w-7 text-primary" />
            <h2 className="text-3xl font-bold font-playfair">ארגז כלים</h2>
          </div>
          <p className="text-muted-foreground">
            גלו טריקים וטיפים מתקדמים ב-Markdown - לחצו על כרטיסיה כדי לנסות בזמן אמת
          </p>
        </div>

        {/* לייאאוט ראשי: סיידבר + תוכן */}
        <div className="flex gap-6">
          {/* סיידבר - רק בדסקטופ */}
          {!isMobile && (
            <ToolboxSidebar
              tips={filteredTips}
              selectedTipId={selectedTip?.id ?? null}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectTip={handleSelectTip}
            />
          )}

          {/* אזור תוכן מרכזי */}
          <div className="flex-1 min-w-0">
            {mode === "grid" ? (
              <ToolboxGrid tips={filteredTips} onSelectTip={handleSelectTip} />
            ) : selectedTip ? (
              <ToolboxPlayground
                tip={selectedTip}
                value={editorValue}
                onChange={setEditorValue}
                onBack={handleBack}
              />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
