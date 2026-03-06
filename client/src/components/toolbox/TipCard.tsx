import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tipCategories, type Tip } from "@/data/tips-data";
import {
  Highlighter, Strikethrough, WrapText, Keyboard,
  FootprintsIcon, Quote, ChevronDown,
  CheckSquare, AlertTriangle, GitCompare,
  EyeOff, Space, Type, LayoutList, Github, Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* מיפוי שמות אייקונים לרכיבי Lucide */
const iconMap: Record<string, LucideIcon> = {
  Highlighter, Strikethrough, WrapText, Keyboard,
  FootprintsIcon, Quote, ChevronDown,
  CheckSquare, AlertTriangle, GitCompare,
  EyeOff, Space, Type, LayoutList, Github, Wand2,
};

interface TipCardProps {
  tip: Tip;
  onSelect: (tip: Tip) => void;
}

export default function TipCard({ tip, onSelect }: TipCardProps) {
  const Icon = iconMap[tip.icon] || Type;
  const categoryInfo = tipCategories[tip.category];

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg break-inside-avoid mb-4 group toolbox-card"
      onClick={() => onSelect(tip)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            {categoryInfo.label}
          </Badge>
        </div>
        <CardTitle className="text-lg font-playfair leading-tight mt-2 group-hover:text-primary transition-colors">
          {tip.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {tip.description}
        </p>
      </CardContent>
    </Card>
  );
}
