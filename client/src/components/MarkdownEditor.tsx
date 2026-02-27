import { useRef, useEffect, useState } from "react";
import { EditorView, keymap, placeholder, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { search } from "@codemirror/search";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import mermaid from "mermaid";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

/* ערכת נושא בהירה מותאמת ל-CodeMirror */
const lightTheme = EditorView.theme({
  "&": {
    fontSize: "14px",
    fontFamily: "Rubik, monospace",
  },
  ".cm-content": {
    padding: "16px 0",
    caretColor: "#000",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    borderRight: "1px solid #e5e7eb",
    color: "#9ca3af",
  },
  ".cm-activeLine": {
    backgroundColor: "#f9fafb",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#f9fafb",
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
    backgroundColor: "#dbeafe",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-line": {
    padding: "0 16px",
  },
});

export default function MarkdownEditor({ value, onChange, height = "500px" }: MarkdownEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [mounted, setMounted] = useState(false);

  /* callback שמעדכן את הstate בכל שינוי בעורך */
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  /* extension שמאזין לשינויים ומעדכן את ה-state */
  const handleChange = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      onChangeRef.current(update.state.doc.toString());
    }
  });

  /* אתחול העורך */
  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        EditorView.lineWrapping,
        keymap.of([...defaultKeymap, indentWithTab]),
        search(),
        placeholder("כתוב כאן Markdown..."),
        lightTheme,
        handleChange,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;
    setMounted(true);

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* סנכרון ערך חיצוני – כשהvalue משתנה מבחוץ (לא מהעורך עצמו) */
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (currentDoc !== value) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: value },
      });
    }
  }, [value]);

  /* אתחול Mermaid */
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: "default" });
  }, []);

  useEffect(() => {
    if (mounted && value.includes("```mermaid")) {
      setTimeout(() => {
        mermaid.contentLoaded();
      }, 100);
    }
  }, [value, mounted]);

  return (
    <div className="grid lg:grid-cols-2 gap-4" style={{ height }}>
      {/* פאנל העורך – ה-ref חייב תמיד להתרנדר כדי שה-useEffect יאתחל את CodeMirror */}
      <div className="border rounded-lg overflow-hidden bg-card flex flex-col" dir="ltr">
        <div className="bg-muted px-4 py-2 text-sm font-medium border-b" dir="rtl">
          עורך Markdown
        </div>
        <div
          ref={editorRef}
          className="flex-1 overflow-auto"
          style={{ height: `calc(${height} - 40px)` }}
        />
      </div>

      {/* פאנל תצוגה מקדימה */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="bg-muted px-4 py-2 text-sm font-medium border-b">
          תצוגה מקדימה
        </div>
        <div
          className="p-6 overflow-auto prose prose-sm max-w-none"
          style={{ height: `calc(${height} - 40px)` }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
              p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="mr-4">{children}</li>,
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                const isMermaid = className === "language-mermaid";

                if (isMermaid) {
                  return (
                    <div className="mermaid my-4">
                      {String(children).replace(/\n$/, "")}
                    </div>
                  );
                }

                return isInline ? (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                ) : (
                  <code
                    className={`${className || ""} block overflow-x-auto text-sm font-mono`}
                    style={{ whiteSpace: "pre", padding: 0 }}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              /* תיקון בעיית הפירמידה – pre שומר על הזחות נכונות */
              pre: ({ children }) => (
                <pre
                  className="mb-4 bg-muted p-4 rounded-lg overflow-x-auto"
                  style={{ whiteSpace: "pre", tabSize: 4 }}
                >
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-r-4 border-primary pr-4 py-2 mb-4 text-muted-foreground italic">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border-collapse border border-border">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-border bg-muted px-4 py-2 text-right font-bold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-border px-4 py-2 text-right">
                  {children}
                </td>
              ),
              hr: () => <hr className="my-6 border-border" />,
              img: ({ src, alt }) => (
                <img src={src} alt={alt} className="max-w-full h-auto rounded-lg my-4" />
              ),
            }}
          >
            {value || "*כתוב משהו כדי לראות תצוגה מקדימה...*"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
