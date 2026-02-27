import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { BookOpen, Code2, Sparkles, Trophy, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30">
      {/* Header */}
      <header className="container py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-8 h-8 text-primary animate-bounce-subtle" />
            <h1 className="text-2xl font-bold gradient-text">Markdown Academy</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/lessons">
                  <Button variant="ghost">השיעורים שלי</Button>
                </Link>
                <Link href="/sandbox">
                  <Button variant="ghost">ארגז חול</Button>
                </Link>
                <Link href="/achievements">
                  <Button variant="ghost">
                    <Trophy className="w-4 h-4 ml-2" />
                    הישגים
                  </Button>
                </Link>
                <span className="text-sm text-muted-foreground">שלום, {user?.name || "משתמש"}!</span>
              </>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>התחברות</a>
              </Button>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8 animate-scale-in">
          <div className="inline-block">
            <Sparkles className="w-16 h-16 text-accent mx-auto mb-4 animate-float" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            למד <span className="gradient-text">Markdown</span>
            <br />
            בדרך המהנה והאינטראקטיבית
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            מהיסודות ועד הטריקים המתקדמים - כל מה שצריך כדי להפוך למאסטר של Markdown.
            עם עורך חי, תרגולים אינטראקטיביים ומעקב התקדמות.
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/lessons">
                <Button size="lg" className="text-lg px-8">
                  <Zap className="w-5 h-5 ml-2" />
                  התחל ללמוד עכשיו
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="text-lg px-8" asChild>
                <a href={getLoginUrl()}>
                  <Zap className="w-5 h-5 ml-2" />
                  התחל ללמוד עכשיו
                </a>
              </Button>
            )}
            <Link href="/sandbox">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Code2 className="w-5 h-5 ml-2" />
                נסה את העורך
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow animate-scale-in glass">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">שיעורים מובנים</h3>
            <p className="text-muted-foreground">
              מסלול לימוד מלא מהבסיס ועד טריקים מתקדמים שלא ידעת. כל שיעור עם תרגילים אינטראקטיביים.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow animate-scale-in glass" style={{ animationDelay: "0.1s" }}>
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold">עורך חי</h3>
            <p className="text-muted-foreground">
              כתוב Markdown וראה את התוצאה בזמן אמת. תמיכה מלאה ב-RTL, תרשימי Mermaid ו-GitHub Flavored Markdown.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow animate-scale-in glass" style={{ animationDelay: "0.2s" }}>
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold">מעקב התקדמות</h3>
            <p className="text-muted-foreground">
              עקוב אחרי ההתקדמות שלך, פתח שיעורים חדשים, וצבור הישגים ותגים מיוחדים בדרך.
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="p-12 max-w-3xl mx-auto glass">
            <h3 className="text-3xl font-bold mb-4">מוכנים להתחיל?</h3>
            <p className="text-lg text-muted-foreground mb-8">
              הצטרפו לאלפי משתמשים שכבר משתמשים ב-Markdown כמו מקצוענים
            </p>
            {isAuthenticated ? (
              <Link href="/lessons">
                <Button size="lg" className="text-lg px-12">
                  לשיעורים
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="text-lg px-12" asChild>
                <a href={getLoginUrl()}>התחל בחינם</a>
              </Button>
            )}
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="container py-8 mt-20 border-t">
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2026 Markdown Academy. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}
