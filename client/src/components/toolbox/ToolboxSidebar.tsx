import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Search, Menu, Type, LayoutList, Github, Wand2 } from "lucide-react";
import { tipCategories, type Tip, type TipCategory } from "@/data/tips-data";
import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

const categoryIconMap: Record<string, LucideIcon> = {
  Type, LayoutList, Github, Wand2,
};

interface ToolboxSidebarProps {
  tips: Tip[];
  selectedTipId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectTip: (tip: Tip) => void;
}

function SidebarContent({
  tips,
  selectedTipId,
  searchQuery,
  onSearchChange,
  onSelectTip,
}: ToolboxSidebarProps) {
  /* קיבוץ לפי קטגוריה */
  const grouped = (Object.keys(tipCategories) as TipCategory[]).reduce(
    (acc, cat) => {
      acc[cat] = tips.filter((t) => t.category === cat);
      return acc;
    },
    {} as Record<TipCategory, Tip[]>,
  );

  return (
    <div className="flex flex-col h-full">
      {/* שורת חיפוש */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש טיפים..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-9"
          />
        </div>
      </div>

      {/* קטגוריות */}
      <ScrollArea className="flex-1">
        <Accordion
          type="multiple"
          defaultValue={Object.keys(tipCategories)}
          className="px-2"
        >
          {(Object.entries(tipCategories) as [TipCategory, { label: string; icon: string }][]).map(
            ([cat, info]) => {
              const catTips = grouped[cat];
              if (catTips.length === 0) return null;
              const CatIcon = categoryIconMap[info.icon] || Type;

              return (
                <AccordionItem key={cat} value={cat}>
                  <AccordionTrigger className="px-2 text-sm text-right hover:no-underline">
                    <span className="flex items-center gap-2">
                      <CatIcon className="h-4 w-4 text-muted-foreground" />
                      {info.label}
                      <span className="text-xs text-muted-foreground">({catTips.length})</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1">
                    <div className="flex flex-col gap-0.5">
                      {catTips.map((tip) => (
                        <button
                          key={tip.id}
                          onClick={() => onSelectTip(tip)}
                          className={cn(
                            "text-right text-sm px-4 py-2 rounded-md transition-colors hover:bg-accent",
                            selectedTipId === tip.id && "bg-accent text-accent-foreground font-medium",
                          )}
                        >
                          {tip.title}
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            },
          )}
        </Accordion>
      </ScrollArea>
    </div>
  );
}

export default function ToolboxSidebar(props: ToolboxSidebarProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="dark toolbox-dark p-0 w-80">
          <SidebarContent
            {...props}
            onSelectTip={(tip) => {
              props.onSelectTip(tip);
              setOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="w-72 shrink-0 border rounded-lg bg-card text-card-foreground overflow-hidden h-[calc(100vh-140px)] sticky top-24">
      <SidebarContent {...props} />
    </aside>
  );
}
