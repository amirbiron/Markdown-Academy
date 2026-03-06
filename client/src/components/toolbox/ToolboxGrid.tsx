import type { Tip } from "@/data/tips-data";
import TipCard from "./TipCard";

interface ToolboxGridProps {
  tips: Tip[];
  onSelectTip: (tip: Tip) => void;
}

export default function ToolboxGrid({ tips, onSelectTip }: ToolboxGridProps) {
  if (tips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg">לא נמצאו טיפים תואמים</p>
        <p className="text-sm mt-1">נסו לחפש מונח אחר</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {tips.map((tip) => (
        <TipCard key={tip.id} tip={tip} onSelect={onSelectTip} />
      ))}
    </div>
  );
}
