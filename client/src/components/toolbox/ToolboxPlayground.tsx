import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Tip } from "@/data/tips-data";
import ToolboxEditor from "./ToolboxEditor";

interface ToolboxPlaygroundProps {
  tip: Tip;
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
}

export default function ToolboxPlayground({ tip, value, onChange, onBack }: ToolboxPlaygroundProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* כותרת + כפתור חזרה */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowRight className="h-4 w-4" />
          חזרה לגריד
        </Button>
        <div className="h-6 w-px bg-border" />
        <div>
          <h2 className="text-xl font-bold font-playfair">{tip.title}</h2>
          <p className="text-sm text-muted-foreground">{tip.description}</p>
        </div>
      </div>

      <ToolboxEditor
        value={value}
        onChange={onChange}
        injectSnippets={tip.injectSnippets}
      />
    </div>
  );
}
