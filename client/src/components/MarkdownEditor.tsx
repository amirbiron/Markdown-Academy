import { useRef, useEffect, useState } from "react";
import { EditorView, keymap, placeholder, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { search } from "@codemirror/search";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { remarkMark } from "remark-mark-highlight";
import { remarkAlert } from "remark-github-blockquote-alert";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import mermaid from "mermaid";
import { Info, Lightbulb, AlertTriangle, OctagonAlert, CircleAlert } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  editorViewRef?: React.MutableRefObject<EditorView | null>;
  darkMode?: boolean;
}

/* סכמת sanitize מורחבת - מתירה mark, kbd, ו-classes של GitHub Alerts */
const customSanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "mark"],
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div || []), "className", "class", "dataType"],
    p: [...(defaultSchema.attributes?.p || []), "className", "class"],
  },
};

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

/* ערכת נושא כהה מותאמת ל-CodeMirror */
const darkTheme = EditorView.theme({
  "&": {
    fontSize: "14px",
    fontFamily: "Rubik, monospace",
  },
  ".cm-content": {
    padding: "16px 0",
    caretColor: "#e5e7eb",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    borderRight: "1px solid oklch(0.40 0.04 230)",
    color: "#6b7280",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
    backgroundColor: "rgba(59, 130, 246, 0.3)",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-line": {
    padding: "0 16px",
  },
}, { dark: true });

/* מיפוי אייקונים לסוגי התראות GitHub */
const alertIcons: Record<string, typeof Info> = {
  note: Info,
  tip: Lightbulb,
  important: CircleAlert,
  warning: AlertTriangle,
  caution: OctagonAlert,
};

const alertLabels: Record<string, string> = {
  note: "הערה",
  tip: "טיפ",
  important: "חשוב",
  warning: "אזהרה",
  caution: "זהירות",
};

const alertColors: Record<string, string> = {
  note: "border-blue-500 bg-blue-500/10",
  tip: "border-green-500 bg-green-500/10",
  important: "border-purple-500 bg-purple-500/10",
  warning: "border-yellow-500 bg-yellow-500/10",
  caution: "border-red-500 bg-red-500/10",
};

const alertTitleColors: Record<string, string> = {
  note: "text-blue-500",
  tip: "text-green-500",
  important: "text-purple-500",
  warning: "text-yellow-500",
  caution: "text-red-500",
};

export default function MarkdownEditor({ value, onChange, height = "500px", editorViewRef, darkMode = false }: MarkdownEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [mounted, setMounted] = useState(false);

  /* callback שמעדכן את הstate בכל שינוי בעורך */
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  /* דגל שמונע קריאה חוזרת ל-onChange כשהעדכון מגיע מבחוץ (לא מהמשתמש) */
  const isExternalUpdate = useRef(false);

  /* extension שמאזין לשינויים ומעדכן את ה-state */
  const handleChange = EditorView.updateListener.of((update) => {
    if (update.docChanged && !isExternalUpdate.current) {
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
        /* כיוון RTL לתמיכה בעברית */
        EditorView.contentAttributes.of({ dir: "rtl" }),
        keymap.of([...defaultKeymap, indentWithTab]),
        search(),
        placeholder("כתוב כאן Markdown..."),
        darkMode ? darkTheme : lightTheme,
        handleChange,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;
    if (editorViewRef) editorViewRef.current = view;
    setMounted(true);

    return () => {
      view.destroy();
      viewRef.current = null;
      if (editorViewRef) editorViewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode]);

  /* סנכרון ערך חיצוני – כשהvalue משתנה מבחוץ (לא מהעורך עצמו) */
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (currentDoc !== value) {
      isExternalUpdate.current = true;
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: value },
      });
      isExternalUpdate.current = false;
    }
  }, [value]);

  /* אתחול Mermaid */
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: darkMode ? "dark" : "default" });
  }, [darkMode]);

  useEffect(() => {
    if (mounted && value.includes("```mermaid")) {
      setTimeout(() => {
        mermaid.contentLoaded();
      }, 100);
    }
  }, [value, mounted]);

  return (
    <div className="grid lg:grid-cols-2 gap-4" style={{ height }}>
      {/* פאנל העורך */}
      <div className="border rounded-lg overflow-hidden bg-card flex flex-col">
        <div className="bg-muted px-4 py-2 text-sm font-medium border-b">
          עורך Markdown
        </div>
        <div
          ref={editorRef}
          className="flex-1 overflow-auto"
          dir="ltr"
          style={{ height: `calc(${height} - 40px)` }}
        />
      </div>

      {/* פאנל תצוגה מקדימה */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="bg-muted px-4 py-2 text-sm font-medium border-b">
          תצוגה מקדימה
        </div>
        <div
          className="p-6 overflow-auto prose prose-sm max-w-none text-foreground"
          style={{ height: `calc(${height} - 40px)` }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMark, remarkAlert]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, customSanitizeSchema], rehypeHighlight]}
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
              p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="mr-4">{children}</li>,
              /* סימון טקסט בצהוב */
              mark: ({ children }) => (
                <mark className="bg-yellow-200 dark:bg-yellow-500/30 text-inherit px-0.5 rounded-sm">{children}</mark>
              ),
              /* מקשי מקלדת */
              kbd: ({ children }) => (
                <kbd className="inline-block px-2 py-0.5 text-xs font-mono font-semibold border border-border rounded-md bg-muted shadow-[0_1px_0_1px] shadow-border/50 align-middle mx-0.5">{children}</kbd>
              ),
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
              pre: ({ children }) => (
                <pre
                  className="mb-4 bg-muted p-4 rounded-lg overflow-x-auto border-0"
                  dir="ltr"
                  style={{ whiteSpace: "pre", tabSize: 4 }}
                >
                  {children}
                </pre>
              ),
              /* ציטוטים משודרגים + תמיכה ב-GitHub Alerts */
              blockquote: ({ children, className, ...props }) => {
                /* זיהוי GitHub Alerts לפי className שהפלאגין מוסיף */
                const alertClass = className || "";
                const alertType = alertClass.match(/markdown-alert-(\w+)/)?.[1];

                if (alertType && alertType in alertColors) {
                  const Icon = alertIcons[alertType] || Info;
                  return (
                    <div className={`border-r-4 rounded-lg p-4 mb-4 ${alertColors[alertType]}`} {...props}>
                      <div className={`flex items-center gap-2 font-bold text-sm mb-2 ${alertTitleColors[alertType]}`}>
                        <Icon className="h-4 w-4" />
                        {alertLabels[alertType]}
                      </div>
                      <div className="text-sm [&>p]:mb-1 [&>p:last-child]:mb-0">{children}</div>
                    </div>
                  );
                }

                /* ציטוט רגיל - עיצוב משודרג */
                return (
                  <blockquote className="border-r-4 border-primary/60 bg-muted/50 rounded-l-lg pr-4 pl-3 py-3 mb-4 text-muted-foreground italic [&>p]:mb-1 [&>p:last-child]:mb-0">
                    {children}
                  </blockquote>
                );
              },
              /* תמיכה ב-div של GitHub Alerts */
              div: ({ children, className, ...props }) => {
                const alertClass = className || "";
                const alertType = alertClass.match(/markdown-alert-(\w+)/)?.[1];

                if (alertType && alertType in alertColors) {
                  const Icon = alertIcons[alertType] || Info;
                  return (
                    <div className={`border-r-4 rounded-lg p-4 mb-4 ${alertColors[alertType]}`} {...props}>
                      <div className={`flex items-center gap-2 font-bold text-sm mb-2 ${alertTitleColors[alertType]}`}>
                        <Icon className="h-4 w-4" />
                        {alertLabels[alertType]}
                      </div>
                      <div className="text-sm [&>p]:mb-1 [&>p:last-child]:mb-0">{children}</div>
                    </div>
                  );
                }

                if (className?.includes("mermaid")) {
                  return <div className={className} {...props}>{children}</div>;
                }

                return <div {...props}>{children}</div>;
              },
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
