import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Code2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, navigate] = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const utils = trpc.useUtils();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegister) {
      if (!name.trim()) {
        setError("נא להזין שם");
        return;
      }
      if (password.length < 6) {
        setError("הסיסמה חייבת להכיל לפחות 6 תווים");
        return;
      }
      registerMutation.mutate({ email, password, name: name.trim() });
    } else {
      loginMutation.mutate({ email, password });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <Code2 className="w-10 h-10 text-primary mx-auto" />
          <h1 className="text-2xl font-bold">Markdown Academy</h1>
          <p className="text-muted-foreground">
            {isRegister ? "צור חשבון חדש" : "התחבר לחשבון שלך"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="name">שם</Label>
              <Input
                id="name"
                type="text"
                placeholder="השם שלך"
                value={name}
                onChange={(e) => setName(e.target.value)}
                dir="rtl"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">אימייל</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">סיסמה</Label>
            <Input
              id="password"
              type="password"
              placeholder={isRegister ? "לפחות 6 תווים" : "הסיסמה שלך"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "טוען..."
              : isRegister
                ? "הרשמה"
                : "התחברות"}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-sm text-primary hover:underline"
            disabled={isLoading}
          >
            {isRegister
              ? "כבר יש לך חשבון? התחבר"
              : "אין לך חשבון? הירשם"}
          </button>
        </div>
      </Card>
    </div>
  );
}
