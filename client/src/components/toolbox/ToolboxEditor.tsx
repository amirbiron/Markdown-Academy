import { useRef } from "react";
import { EditorView } from "@codemirror/view";
import MarkdownEditor from "@/components/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { InjectSnippet } from "@/data/tips-data";

interface ToolboxEditorProps {
  value: string;
  onChange: (value: string) => void;
  injectSnippets?: InjectSnippet[];
}

export default function ToolboxEditor({ value, onChange, injectSnippets }: ToolboxEditorProps) {
  const editorViewRef = useRef<EditorView | null>(null);

  /** הזרקת טקסט במיקום הסמן הנוכחי */
  function injectAtCursor(snippet: string, cursorOffset?: number) {
    const view = editorViewRef.current;
    if (!view) return;

    const cursor = view.state.selection.main.head;
    view.dispatch({
      changes: { from: cursor, insert: snippet },
      selection: { anchor: cursor + (cursorOffset ?? snippet.length) },
    });
    view.focus();
  }

  return (
    <div className="flex flex-col gap-3">
      {/* סרגל כפתורי הזרקה מהירה */}
      {injectSnippets && injectSnippets.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border">
          <span className="text-sm text-muted-foreground self-center ml-2">הזרקה מהירה:</span>
          {injectSnippets.map((s) => (
            <Tooltip key={s.label}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => injectAtCursor(s.snippet, s.cursorOffset)}
                  className="text-xs"
                >
                  {s.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <code className="text-xs" dir="ltr">{s.snippet}</code>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}

      <MarkdownEditor
        value={value}
        onChange={onChange}
        height="calc(100vh - 340px)"
        editorViewRef={editorViewRef}
      />
    </div>
  );
}
