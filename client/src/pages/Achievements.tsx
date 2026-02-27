import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { LOGIN_PATH } from "@/const";
import { Award, Code2, Lock, Sparkles, Star, Trophy, Zap } from "lucide-react";
import { Link } from "wouter";

const achievementConfig = {
  first_lesson: {
    title: "צעדים ראשונים",
    description: "השלמת את השיעור הראשון שלך",
    icon: Sparkles,
    color: "text-yellow-500",
  },
  halfway: {
    title: "באמצע הדרך",
    description: "השלמת חצי מהשיעורים",
    icon: Star,
    color: "text-blue-500",
  },
  all_complete: {
    title: "מאסטר Markdown",
    description: "השלמת את כל השיעורים!",
    icon: Trophy,
    color: "text-purple-500",
  },
};

export default function Achievements() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { data: achievements, isLoading: achievementsLoading } = trpc.achievements.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (authLoading || achievementsLoading) {
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
            כדי לראות את ההישגים שלך, יש להתחבר למערכת.
          </p>
          <Button asChild size="lg">
            <a href={LOGIN_PATH}>התחברות</a>
          </Button>
        </Card>
      </div>
    );
  }

  const earnedAchievements = achievements?.map(a => a.achievementType) || [];
  const allAchievementTypes = Object.keys(achievementConfig);

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
            <Link href="/lessons">
              <Button variant="ghost">שיעורים</Button>
            </Link>
            <Link href="/sandbox">
              <Button variant="ghost">ארגז חול</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-scale-in">
          <Trophy className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce-subtle" />
          <h2 className="text-4xl font-bold mb-4">ההישגים שלך</h2>
          <p className="text-xl text-muted-foreground">
            צברת {earnedAchievements.length} מתוך {allAchievementTypes.length} הישגים
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {allAchievementTypes.map((type) => {
            const config = achievementConfig[type as keyof typeof achievementConfig];
            const earned = earnedAchievements.includes(type);
            const Icon = config.icon;

            return (
              <Card
                key={type}
                className={`p-8 text-center transition-all ${
                  earned
                    ? "glass hover:shadow-xl animate-scale-in"
                    : "opacity-50 grayscale"
                }`}
              >
                <div
                  className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    earned ? "bg-primary/10" : "bg-muted"
                  }`}
                >
                  <Icon className={`w-10 h-10 ${earned ? config.color : "text-muted-foreground"}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{config.title}</h3>
                <p className="text-sm text-muted-foreground">{config.description}</p>
                {earned && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-green-600 font-medium">
                    <Award className="w-4 h-4" />
                    הושג!
                  </div>
                )}
                {!earned && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    נעול
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        {earnedAchievements.length < allAchievementTypes.length && (
          <div className="text-center mt-12">
            <Card className="p-8 max-w-2xl mx-auto glass">
              <Zap className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">המשך ללמוד ולצבור הישגים!</h3>
              <p className="text-muted-foreground mb-6">
                עוד {allAchievementTypes.length - earnedAchievements.length} הישגים מחכים לך
              </p>
              <Link href="/lessons">
                <Button size="lg">חזרה לשיעורים</Button>
              </Link>
            </Card>
          </div>
        )}

        {earnedAchievements.length === allAchievementTypes.length && (
          <div className="text-center mt-12">
            <Card className="p-8 max-w-2xl mx-auto glass">
              <Trophy className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce-subtle" />
              <h3 className="text-2xl font-bold mb-4">מזל טוב! 🎉</h3>
              <p className="text-muted-foreground mb-6">
                השלמת את כל ההישגים! אתה עכשיו מאסטר Markdown אמיתי.
              </p>
              <Link href="/sandbox">
                <Button size="lg">המשך לתרגל בארגז החול</Button>
              </Link>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
