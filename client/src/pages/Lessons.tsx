import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { ArrowRight, BookOpen, CheckCircle2, Code2, Lock } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Lessons() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  const { data: lessons, isLoading: lessonsLoading } = trpc.lessons.list.useQuery();
  const { data: progressList } = trpc.progress.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (authLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30 flex items-center justify-center">
        <Card className="p-12 max-w-md text-center glass">
          <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">נדרשת התחברות</h2>
          <p className="text-muted-foreground mb-6">
            כדי לגשת לשיעורים ולעקוב אחרי ההתקדמות שלך, יש להתחבר למערכת.
          </p>
          <Button asChild size="lg">
            <a href={getLoginUrl()}>התחברות</a>
          </Button>
        </Card>
      </div>
    );
  }

  const completedLessons = progressList?.filter(p => p.completed).length || 0;
  const totalLessons = lessons?.length || 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const groupedLessons = {
    basics: lessons?.filter(l => l.category === "basics") || [],
    intermediate: lessons?.filter(l => l.category === "intermediate") || [],
    advanced: lessons?.filter(l => l.category === "advanced") || [],
  };

  const isLessonCompleted = (lessonId: number) => {
    return progressList?.some(p => p.lessonId === lessonId && p.completed) || false;
  };

  const isLessonUnlocked = (lesson: any, index: number, category: string) => {
    if (index === 0 && category === "basics") return true;
    
    const allLessons = [...groupedLessons.basics, ...groupedLessons.intermediate, ...groupedLessons.advanced];
    const lessonIndex = allLessons.findIndex(l => l.id === lesson.id);
    
    if (lessonIndex === 0) return true;
    
    const previousLesson = allLessons[lessonIndex - 1];
    return previousLesson ? isLessonCompleted(previousLesson.id) : false;
  };

  const categoryTitles = {
    basics: "יסודות",
    intermediate: "בינוני",
    advanced: "מתקדם",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30">
      {/* Header */}
      <header className="container py-6 border-b bg-card/50 backdrop-blur">
        <nav className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Code2 className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold gradient-text">Markdown Academy</h1>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/sandbox">
              <Button variant="ghost">ארגז חול</Button>
            </Link>
            <Link href="/achievements">
              <Button variant="ghost">הישגים</Button>
            </Link>
            <span className="text-sm text-muted-foreground">שלום, {user?.name || "משתמש"}!</span>
          </div>
        </nav>
      </header>

      <main className="container py-12">
        {/* Progress Overview */}
        <Card className="p-8 mb-12 glass">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">ההתקדמות שלך</h2>
              <p className="text-muted-foreground">
                השלמת {completedLessons} מתוך {totalLessons} שיעורים
              </p>
            </div>
            <div className="text-4xl font-bold gradient-text">
              {Math.round(progressPercentage)}%
            </div>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </Card>

        {/* Lessons by Category */}
        {Object.entries(groupedLessons).map(([category, categoryLessons]) => (
          <div key={category} className="mb-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              {categoryTitles[category as keyof typeof categoryTitles]}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryLessons.map((lesson, index) => {
                const completed = isLessonCompleted(lesson.id);
                const unlocked = isLessonUnlocked(lesson, index, category);

                return (
                  <Card
                    key={lesson.id}
                    className={`p-6 transition-all hover:shadow-lg ${
                      !unlocked ? "opacity-60" : "cursor-pointer glass"
                    }`}
                    onClick={() => unlocked && navigate(`/lesson/${lesson.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold mb-2">{lesson.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lesson.description}
                        </p>
                      </div>
                      {completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mr-2" />
                      ) : !unlocked ? (
                        <Lock className="w-6 h-6 text-muted-foreground flex-shrink-0 mr-2" />
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {lesson.duration} דקות
                      </span>
                      {unlocked && (
                        <Button size="sm" variant={completed ? "outline" : "default"}>
                          {completed ? "חזור לשיעור" : "התחל"}
                          <ArrowLeft className="w-4 h-4 mr-2" />
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
