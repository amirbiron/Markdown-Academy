import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { LOGIN_PATH } from "@/const";
import { ArrowRight, CheckCircle2, CheckSquare, Code2, Lightbulb, Lock, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useLocation, useRoute } from "wouter";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MarkdownEditor from "@/components/MarkdownEditor";

export default function LessonView() {
  const [, params] = useRoute("/lesson/:id");
  const [, navigate] = useLocation();
  const lessonId = params?.id ? parseInt(params.id) : 0;

  const { isAuthenticated, loading: authLoading } = useAuth();
  const { data: lesson, isLoading: lessonLoading } = trpc.lessons.get.useQuery({ id: lessonId });
  const { data: progress } = trpc.progress.get.useQuery({ lessonId }, { 
    enabled: isAuthenticated,
  });
  const { data: allLessons } = trpc.lessons.list.useQuery();
  
  const completeLesson = trpc.progress.complete.useMutation({
    onSuccess: () => {
      toast.success("כל הכבוד! השיעור הושלם בהצלחה 🎉");
      utils.progress.list.invalidate();
      utils.progress.get.invalidate();
    },
  });

  const utils = trpc.useUtils();
  const [editorValue, setEditorValue] = useState("");
  const [showSolution, setShowSolution] = useState(false);

  // איפוס מצב בעת מעבר בין שיעורים
  useEffect(() => {
    setShowSolution(false);
    setEditorValue("");
  }, [lessonId]);

  if (authLoading || lessonLoading) {
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
            כדי לגשת לשיעורים, יש להתחבר למערכת.
          </p>
          <Button asChild size="lg">
            <a href={LOGIN_PATH}>התחברות</a>
          </Button>
        </Card>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30 flex items-center justify-center">
        <Card className="p-12 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">שיעור לא נמצא</h2>
          <Link href="/lessons">
            <Button>חזרה לשיעורים</Button>
          </Link>
        </Card>
      </div>
    );
  }

  let lessonContent;
  try {
    lessonContent = JSON.parse(lesson.content);
  } catch {
    lessonContent = { theory: "", examples: "", exercise: "" };
  }

  const handleComplete = () => {
    completeLesson.mutate({
      lessonId: lesson.id,
      exerciseData: editorValue,
    });
  };

  const findNextLesson = () => {
    if (!allLessons) return null;
    const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
    return currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  };

  const nextLesson = findNextLesson();

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
              <Button variant="ghost" size="sm">חזרה לשיעורים</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container py-8">
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">{lesson.title}</h2>
              <p className="text-muted-foreground">{lesson.description}</p>
            </div>
            {progress?.completed && (
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            )}
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Theory Panel */}
          <Card className="p-6 glass overflow-auto max-h-[600px]">
            <h3 className="text-xl font-bold mb-4">תיאוריה</h3>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: lessonContent.theory || "" }} />
            
            {lessonContent.examples && (
              <>
                <h3 className="text-xl font-bold mt-6 mb-4">דוגמאות</h3>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: lessonContent.examples || "" }} />
              </>
            )}
          </Card>

          {/* Editor Panel */}
          <Card className="p-6 glass">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">תרגול</h3>
              {lessonContent.tip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" className="gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      טיפ
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-sm">{lessonContent.tip}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {lessonContent.exercise || "נסה לכתוב Markdown בעורך ותראה את התוצאה בזמן אמת"}
            </p>
            <MarkdownEditor value={editorValue} onChange={setEditorValue} />

            {/* בדוק פתרון */}
            {lessonContent.checkSolution && (
              <div className="mt-4">
                <Button
                  onClick={() => setShowSolution(!showSolution)}
                  variant="outline"
                  className="w-full gap-2 hover:bg-primary/10 transition-colors"
                >
                  <CheckSquare className="w-4 h-4" />
                  {showSolution ? "הסתר פתרון" : "בדוק פתרון"}
                </Button>

                {showSolution && (
                  <div className="mt-3 p-4 rounded-lg border-2 bg-green-50 border-green-300 text-green-900">
                    <p className="text-sm font-medium mb-2">פתרון לדוגמה:</p>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: lessonContent.checkSolution }} />
                  </div>
                )}
              </div>
            )}

            {/* שגיאות נפוצות */}
            {lessonContent.commonMistakes && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-yellow-900 mb-2">שגיאות נפוצות</h4>
                    <div className="text-sm text-yellow-800 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: lessonContent.commonMistakes }} />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Link href="/lessons">
            <Button variant="outline">
              <ArrowRight className="w-4 h-4 ml-2" />
              חזרה לרשימת השיעורים
            </Button>
          </Link>
          
          <div className="flex gap-4">
            {!progress?.completed && (
              <Button
                size="lg"
                onClick={handleComplete}
                disabled={completeLesson.isPending}
              >
                {completeLesson.isPending ? "שומר..." : "סיימתי את השיעור"}
                <CheckCircle2 className="w-5 h-5 mr-2" />
              </Button>
            )}
            
            {progress?.completed && nextLesson && (
              <Button
                size="lg"
                onClick={() => navigate(`/lesson/${nextLesson.id}`)}
              >
                השיעור הבא
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            )}
          </div>
        </div>
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
